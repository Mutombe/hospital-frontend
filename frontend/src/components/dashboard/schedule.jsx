// components/doctors/DoctorScheduleDisplay.js
import React from 'react';

const DoctorScheduleDisplay = ({ doctor }) => {
  if (!doctor.schedule || doctor.schedule.length === 0) {
    return (
      <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
        <p className="text-yellow-700 font-medium">
          This doctor has not set up their availability schedule yet.
        </p>
      </div>
    );
  }

  const daysOfWeek = [
    { value: 0, label: 'Monday' },
    { value: 1, label: 'Tuesday' },
    { value: 2, label: 'Wednesday' },
    { value: 3, label: 'Thursday' },
    { value: 4, label: 'Friday' },
    { value: 5, label: 'Saturday' },
    { value: 6, label: 'Sunday' }
  ];

  return (
    <div className="mt-4">
      <h4 className="font-medium text-gray-700 mb-2">Doctor's Regular Schedule</h4>
      <div className="bg-gray-50 rounded-lg p-4">
        {daysOfWeek.map(day => {
          const schedule = doctor.schedule.find(s => s.day_of_week === day.value);
          
          return (
            <div key={day.value} className="flex justify-between items-center py-2 border-b last:border-b-0">
              <span className="font-medium">{day.label}</span>
              {schedule && schedule.is_available ? (
                <span className="text-green-600">
                  {schedule.start_time} - {schedule.end_time}
                </span>
              ) : (
                <span className="text-red-600">Not available</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DoctorScheduleDisplay;