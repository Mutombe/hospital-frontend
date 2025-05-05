import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Calendar, 
  Clock, 
  User, 
  Users,
  ChevronRight, 
  ChevronLeft,
  Search,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { format, addDays, subDays, startOfDay, parseISO, isAfter } from 'date-fns';
import { fetchDoctors } from '../../redux/slices/doctorSlice';
import { bookAppointment } from '../../redux/slices/patientSlice';
import api from '../../utils/api';

const DoctorAppointmentBooking = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { doctors, loading: doctorsLoading } = useSelector((state) => state.doctor);
  const { patient } = useSelector((state) => state.patient);
  
  // Local state
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState('General Checkup');
  const [notes, setNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [bookingStep, setBookingStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  
  // Filter for specialties
  const specialties = [...new Set(doctors?.map(doctor => doctor.specialty?.name).filter(Boolean))];
  
  // Filtered doctors based on search and specialty
  const filteredDoctors = doctors?.filter(doctor => {
    const doctorName = `${doctor.user?.first_name} ${doctor.user?.last_name}`.toLowerCase();
    const matchesSearch = searchQuery === '' || doctorName.includes(searchQuery.toLowerCase());
    const matchesSpecialty = specialtyFilter === '' || doctor.specialty?.name === specialtyFilter;
    return matchesSearch && matchesSpecialty;
  });

  // Load doctors on mount
  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);
  
  // Get doctor availability when doctor or date changes
  useEffect(() => {
    if (selectedDoctor) {
      fetchAvailability();
    }
  }, [selectedDoctor, selectedDate]);
  
  // Fetch doctor availability
  const fetchAvailability = async () => {
    if (!selectedDoctor) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const response = await api.get(
        `/doctors/${selectedDoctor.id}/availability/?date=${dateString}`
      );
      setAvailableSlots(response.data.available_slots);
    } catch (err) {
      setError('Failed to fetch doctor availability.');
      console.error('Error fetching availability:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle date navigation
  const handlePreviousDay = () => {
    // Don't allow selecting dates in the past
    const today = startOfDay(new Date());
    const prevDay = subDays(selectedDate, 1);
    if (!isAfter(today, prevDay)) {
      setSelectedDate(prevDay);
    }
  };
  
  const handleNextDay = () => {
    setSelectedDate(addDays(selectedDate, 1));
  };
  
  // Handle doctor selection
  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedSlot(null);
    setBookingStep(2);
  };
  
  // Handle time slot selection
  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setBookingStep(3);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDoctor || !selectedSlot) {
      setError('Please select a doctor and appointment time.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Format time from "HH:MM" to a proper time field
      const [hours, minutes] = selectedSlot.split(':');
      
      const appointmentData = {
        doctor: selectedDoctor.id,
        patient: patient.id,
        appointment_date: format(selectedDate, 'yyyy-MM-dd'),
        appointment_time: `${hours}:${minutes}:00`,
        reason: reason,
        notes: notes
      };
      
      await dispatch(bookAppointment(appointmentData)).unwrap();
      
      //dispatch(setNotification({
        //type: 'success',
        //message: 'Appointment booked successfully!'
      //}));
      
      setBookingSuccess(true);
      
      // Reset form
      setTimeout(() => {
        setBookingSuccess(false);
        setSelectedDoctor(null);
        setSelectedSlot(null);
        setReason('General Checkup');
        setNotes('');
        setBookingStep(1);
      }, 3000);
      
    } catch (err) {
      setError(err.message || 'Failed to book appointment. Please try again.');
      console.error('Error booking appointment:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Format time for display
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    return `${hour % 12 || 12}:${minutes} ${ampm}`;
  };
  
  // Render booking steps
  const renderStepOne = () => (
    <div className="space-y-6">
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Find a Doctor</h3>
        
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search by doctor name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <select
            className="py-2 px-4 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
          >
            <option value="">All Specialties</option>
            {specialties.map((specialty, index) => (
              <option key={index} value={specialty}>{specialty}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto">
        {doctorsLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredDoctors?.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => handleDoctorSelect(doctor)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-gray-800">
                    Dr. {doctor.user?.id} {doctor.user?.username}
                  </h4>
                  {doctor.specialty && (
                    <p className="text-sm text-gray-600">{doctor.specialty.name}</p>
                  )}
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-gray-500">No doctors found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
  
  const renderStepTwo = () => (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <button 
          onClick={() => setBookingStep(1)}
          className="mr-2 text-blue-500 hover:text-blue-700 flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </button>
        <h3 className="text-lg font-medium">Select a Time</h3>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={handlePreviousDay}
          className="p-2 text-gray-400 hover:text-gray-600"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <div className="text-center">
          <div className="flex items-center justify-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-500" />
            <span className="font-medium">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {selectedDoctor && `Dr. ${selectedDoctor.user.last_name}'s Availability`}
          </p>
        </div>
        
        <button 
          onClick={handleNextDay}
          className="p-2 text-gray-400 hover:text-gray-600"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      ) : availableSlots.length > 0 ? (
        <div className="grid grid-cols-3 gap-3">
          {availableSlots.map((slot, index) => (
            <button
              key={index}
              className={`py-3 px-4 rounded-md border text-center hover:shadow-md transition-all ${
                selectedSlot === slot
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-800 border-gray-200'
              }`}
              onClick={() => handleSlotSelect(slot)}
            >
              <div className="flex items-center justify-center">
                <Clock className="h-4 w-4 mr-1" />
                {formatTime(slot)}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Clock className="h-12 w-12 text-gray-400 mb-2" />
          <p className="text-gray-500">No available time slots for this date</p>
          <p className="text-sm text-gray-400 mt-2">Try selecting another date</p>
        </div>
      )}
    </div>
  );
  
  const renderStepThree = () => (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <button 
          onClick={() => setBookingStep(2)}
          className="mr-2 text-blue-500 hover:text-blue-700 flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </button>
        <h3 className="text-lg font-medium">Confirm Appointment</h3>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex flex-col space-y-3">
          <div className="flex items-start">
            <User className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
            <div>
              <p className="font-medium">Doctor</p>
              <p className="text-gray-600">
                Dr. {selectedDoctor?.user.first_name} {selectedDoctor?.user.last_name}
                {selectedDoctor?.specialty && ` (${selectedDoctor.specialty.name})`}
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Calendar className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
            <div>
              <p className="font-medium">Date</p>
              <p className="text-gray-600">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Clock className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
            <div>
              <p className="font-medium">Time</p>
              <p className="text-gray-600">{formatTime(selectedSlot)}</p>
            </div>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Reason for Visit
          </label>
          <select
            className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          >
            <option value="General Checkup">General Checkup</option>
            <option value="Follow-up">Follow-up</option>
            <option value="Consultation">Consultation</option>
            <option value="Urgent Care">Urgent Care</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Additional Notes (Optional)
          </label>
          <textarea
            className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            rows="3"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Please describe your symptoms or reason for visit in detail..."
          ></textarea>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          disabled={loading}
        >
          {loading ? 'Booking...' : 'Confirm Appointment'}
        </button>
      </form>
    </div>
  );
  
  const renderSuccessMessage = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-green-100 rounded-full p-3 mb-4">
        <CheckCircle className="h-12 w-12 text-green-500" />
      </div>
      <h3 className="text-xl font-medium text-gray-800 mb-2">Appointment Booked!</h3>
      <p className="text-gray-600 mb-6">
        Your appointment has been successfully scheduled.
      </p>
      <div className="bg-gray-50 p-4 rounded-lg mb-6 w-full max-w-md">
        <div className="flex flex-col space-y-3">
          <div className="flex items-start">
            <User className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
            <div>
              <p className="font-medium">Doctor</p>
              <p className="text-gray-600">
                Dr. {selectedDoctor?.user.first_name} {selectedDoctor?.user.last_name}
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Calendar className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
            <div>
              <p className="font-medium">Date</p>
              <p className="text-gray-600">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Clock className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
            <div>
              <p className="font-medium">Time</p>
              <p className="text-gray-600">{formatTime(selectedSlot)}</p>
            </div>
          </div>
        </div>
      </div>
      <button
        className="text-blue-500 hover:text-blue-700 font-medium"
        onClick={() => {
          setBookingSuccess(false);
          setBookingStep(1);
        }}
      >
        Book Another Appointment
      </button>
    </div>
  );
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Book an Appointment</h2>
      
      {!bookingSuccess ? (
        <div>
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                bookingStep >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <div className={`flex-1 h-1 mx-2 ${
                bookingStep >= 2 ? 'bg-blue-500' : 'bg-gray-200'
              }`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                bookingStep >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <div className={`flex-1 h-1 mx-2 ${
                bookingStep >= 3 ? 'bg-blue-500' : 'bg-gray-200'
              }`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                bookingStep >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                3
              </div>
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-gray-600">Select Doctor</span>
              <span className="text-gray-600">Choose Time</span>
              <span className="text-gray-600">Confirm</span>
            </div>
          </div>
          
          {bookingStep === 1 && renderStepOne()}
          {bookingStep === 2 && renderStepTwo()}
          {bookingStep === 3 && renderStepThree()}
        </div>
      ) : (
        renderSuccessMessage()
      )}
    </div>
  );
};

export default DoctorAppointmentBooking;