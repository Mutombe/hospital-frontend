// components/appointments/AdvancedAvailabilityDebugger.js
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RefreshCw, AlertCircle, Calendar, Clock } from 'lucide-react';

const AdvancedAvailabilityDebugger = ({ doctorId, date }) => {
  const [debugInfo, setDebugInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(state => state.auth);

  const fetchDebugInfo = async () => {
    if (!user || user.role !== 'DOCTOR') return;
    
    try {
      setLoading(true);
      const response = await fetch(`https://hospital-pf5g.onrender.com/api/doctors/${doctorId}/availability-debug/?date=${date}`);
      const data = await response.json();
      setDebugInfo(data);
    } catch (error) {
      console.error('Error fetching debug info:', error);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'DOCTOR') return null;

  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          Doctor Debug Info
        </h4>
        <button
          onClick={fetchDebugInfo}
          disabled={loading}
          className="flex items-center text-sm bg-gray-600 text-white px-2 py-1 rounded-md hover:bg-gray-700 disabled:opacity-50"
        >
          <RefreshCw className={`h-3 w-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
          Refresh Debug
        </button>
      </div>
      
      {debugInfo && (
        <div className="mt-3 p-3 bg-white rounded-md text-xs">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <span className="font-medium">Date:</span> {debugInfo.date}
            </div>
            <div>
              <span className="font-medium">Day of Week:</span> {debugInfo.day_of_week} ({['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][debugInfo.day_of_week]})
            </div>
            <div>
              <span className="font-medium">On Leave:</span> 
              <span className={debugInfo.on_leave ? 'text-red-600' : 'text-green-600'}>
                {debugInfo.on_leave ? 'Yes' : 'No'}
              </span>
            </div>
            <div>
              <span className="font-medium">Has Schedule:</span> 
              <span className={debugInfo.has_schedule ? 'text-green-600' : 'text-red-600'}>
                {debugInfo.has_schedule ? 'Yes' : 'No'}
              </span>
            </div>
            <div>
              <span className="font-medium">Appointments:</span> {debugInfo.appointments_count}/{debugInfo.max_patients}
            </div>
            <div>
              <span className="font-medium">Available:</span> 
              <span className={debugInfo.is_available ? 'text-green-600' : 'text-red-600'}>
                {debugInfo.is_available ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
          
          {debugInfo.schedule && (
            <div className="mb-3">
              <span className="font-medium">Schedule:</span> {debugInfo.schedule.start_time} - {debugInfo.schedule.end_time}
            </div>
          )}
          
          {debugInfo.leave_reason && (
            <div className="mb-3 p-2 bg-red-50 rounded">
              <span className="font-medium">Leave Reason:</span> {debugInfo.leave_reason}
            </div>
          )}
          
          {debugInfo.appointments && debugInfo.appointments.length > 0 && (
            <div>
              <span className="font-medium">Existing Appointments:</span>
              <ul className="mt-1">
                {debugInfo.appointments.map((app, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{app.time}</span>
                    <span className={app.status === 'CONFIRMED' ? 'text-green-600' : 'text-yellow-600'}>
                      {app.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedAvailabilityDebugger;