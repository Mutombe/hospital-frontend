// components/appointments/AppointmentBooking.js - Fixed version
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { bookAppointment } from '../../redux/slices/patientSlice';
import { Calendar, Clock, User, Search } from 'lucide-react';
import { fetchDoctors } from './../../redux/slices/doctorSlice';
import api from '../../utils/api'; // Use your configured API instance

const AppointmentBooking = () => {
  const dispatch = useDispatch();
  const { doctors, loading, error } = useSelector((state) => state.doctor);
  const { user, isAuthenticated, tokens } = useSelector((state) => state.auth);
  
  // State variables
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('General Checkup');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  // Check if user is authenticated
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-900">Please Login</h2>
          <p className="mt-2 text-sm text-gray-500">
            You need to be logged in to book an appointment.
          </p>
        </div>
      </div>
    );
  }

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setStep(2);
  };

  const fetchAvailability = async (date) => {
    if (!selectedDoctor) return;
    
    try {
      // Use your configured API instance instead of fetch
      const response = await api.get(`/doctors/${selectedDoctor.id}/availability/?date=${date}`);
      
      if (response.data.available_slots) {
        setAvailableSlots(response.data.available_slots);
      } else {
        generateDefaultTimeSlots();
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
      generateDefaultTimeSlots();
    }
  };

  const generateDefaultTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    setAvailableSlots(slots);
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setSelectedTime('');
    if (date) {
      fetchAvailability(date);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedDate || !selectedTime || submitting) return;
    
    setSubmitting(true);
    
    try {
      const appointmentData = {
        doctor: selectedDoctor.id,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        reason: reason
      };
      
      console.log('Sending appointment data:', appointmentData);
      
      // Use Redux action which will handle JWT authentication automatically
      const result = await dispatch(bookAppointment(appointmentData));
      
      if (bookAppointment.fulfilled.match(result)) {
        setStep(3);
      } else {
        // Handle error from Redux action
        const errorMessage = result.payload?.error || result.error?.message || 'Failed to book appointment';
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 3) {
    return (
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <Calendar className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="mt-4 text-lg font-medium text-gray-900">Appointment Request Sent!</h2>
          <p className="mt-2 text-sm text-gray-500">
            Your appointment with Dr. {selectedDoctor.user.username} on {selectedDate} at {selectedTime} has been booked.
          </p>
          <button
            onClick={() => {
              setStep(1);
              setSelectedDoctor(null);
              setSelectedDate('');
              setSelectedTime('');
              setReason('General Checkup');
              setAvailableSlots([]);
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Book Another Appointment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Book an Appointment</h2>
      
      {step === 1 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Select a Doctor</h3>
          
          {loading && <p>Loading doctors...</p>}
          {error && <p className="text-red-500">Error loading doctors: {error}</p>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleDoctorSelect(doctor)}
              >
                <div className="flex items-center mb-2">
                  <div className="bg-gray-200 h-10 w-10 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">Dr. {doctor.user.username}</p>
                    <p className="text-sm text-gray-500">{doctor.specialty?.name || 'General Practice'}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{doctor.bio || 'No bio available'}</p>
                <p className="text-sm font-medium mt-2">Fee: ${doctor.consultation_fee}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {step === 2 && selectedDoctor && (
        <div>
          <div className="flex items-center mb-6">
            <button
              onClick={() => setStep(1)}
              className="mr-2 p-1 rounded-full hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h3 className="text-lg font-medium">
              Book with Dr. {selectedDoctor.user.username}
            </h3>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            {selectedDate && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
                
                {availableSlots.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`py-2 px-3 rounded-md text-sm transition-colors ${
                          selectedTime === slot
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                    <span className="ml-2">Loading available slots...</span>
                  </div>
                )}
              </div>
            )}
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={!selectedDate || !selectedTime || submitting}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Booking...
                </>
              ) : (
                'Book Appointment'
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AppointmentBooking;