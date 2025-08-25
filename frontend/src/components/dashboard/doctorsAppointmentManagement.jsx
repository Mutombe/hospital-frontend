// Frontend: components/DoctorAppointmentManagement.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAppointments } from '../../redux/slices/patientSlice';
import { fetchDoctorAppointments } from '../../redux/slices/doctorSlice';
import { handleAppointment } from '../../redux/slices/doctorSlice';
import { Calendar, Clock, User, CheckCircle, XCircle, MessageSquare } from 'lucide-react';


const DoctorAppointmentManagement = () => {
  const dispatch = useDispatch();
  const { appointments, loading } = useSelector((state) => state.doctor);
  const [filter, setFilter] = useState('all');
  const [rejectNote, setRejectNote] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  useEffect(() => {
  dispatch(fetchDoctorAppointments());
}, [dispatch]);

  const filteredAppointments = appointments.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const handleAccept = (appointmentId) => {
    dispatch(handleAppointment({ appointmentId, status: 'CONFIRMED' }));
  };

  const handleReject = (appointmentId) => {
    if (!rejectNote.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    dispatch(handleAppointment({ appointmentId, status: 'REJECTED', note: rejectNote }));
    setRejectNote('');
    setSelectedAppointment(null);
  };

  const openRejectModal = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const closeRejectModal = () => {
    setSelectedAppointment(null);
    setRejectNote('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading appointments...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Appointment Management</h2>
      
      <div className="mb-6 flex space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          All Appointments
        </button>
        <button
          onClick={() => setFilter('PENDING')}
          className={`px-4 py-2 rounded-lg ${filter === 'PENDING' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter('CONFIRMED')}
          className={`px-4 py-2 rounded-lg ${filter === 'CONFIRMED' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          Confirmed
        </button>
        <button
          onClick={() => setFilter('CANCELLED')}
          className={`px-4 py-2 rounded-lg ${filter === 'CANCELLED' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          Cancelled
        </button>
      </div>
      
      {filteredAppointments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2">No appointments found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <div key={appointment.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                  <div className="bg-gray-200 h-12 w-12 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{appointment.patient.user.username}</h3>
                    <p className="text-sm text-gray-500">MRN: {appointment.patient.mrn}</p>
                    <div className="flex items-center mt-1 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(appointment.appointment_date)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{appointment.appointment_time}</span>
                    </div>
                    <p className="mt-1">
                      <span className="font-medium">Reason:</span> {appointment.reason}
                    </p>
                    {appointment.notes && (
                      <p className="mt-1 text-sm">
                        <span className="font-medium">Notes:</span> {appointment.notes}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    appointment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    appointment.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {appointment.status}
                  </span>
                  
                  {appointment.status === 'PENDING' && (
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => handleAccept(appointment.id)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-full"
                        title="Accept Appointment"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => openRejectModal(appointment)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                        title="Reject Appointment"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Reject Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Reject Appointment</h3>
            <p className="mb-2">Please provide a reason for rejecting this appointment:</p>
            <textarea
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              placeholder="Reason for rejection..."
            />
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={closeRejectModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedAppointment.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointmentManagement;