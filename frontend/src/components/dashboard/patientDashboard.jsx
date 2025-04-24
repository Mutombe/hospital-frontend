import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Calendar,
  Clock,
  ChevronRight,
  AlertCircle,
  Activity,
  Thermometer,
  Heart,
  Droplet,
  Pill,
  FileText,
  Plus,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAppointments } from '../../redux/slices/patientSlice';
import { fetchVitalHistory } from '../../redux/slices/vitalsignsSlice';
import { fetchMedicalRecords } from '../../redux/slices/medicalrecordsSlice';
import { fetchDiagnoses } from '../../redux/slices/diagnosisSlice';
import { fetchMedications } from '../../redux/slices/medicationSlice';


const PatientDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { 
    appointments,   
    loading,
    error 
  } = useSelector((state) => state.patient);
  const { vitalHistory, loading: vitalSignsLoading, error: vitalSignsError } = useSelector((state) => state.vitalSigns);
  const { diagnoses, loading: diagnosesLoading, error: diagnosesError } = useSelector((state) => state.diagnosis);
  const { medications, loading: medicationsLoading, error: medicationsError } = useSelector((state) => state.medication);
  const { records: medicalRecords, loading: medicalRecordsLoading, error: medicalRecordsError } = useSelector((state) => state.medicalRecords);


  
  const [showAllAppointments, setShowAllAppointments] = useState(false);
  const [showAllMedications, setShowAllMedications] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showRecordDetails, setShowRecordDetails] = useState(false);
  
  useEffect(() => {
    if (user) {
      dispatch(fetchAppointments());
      dispatch(fetchMedicalRecords());
      dispatch(fetchVitalHistory());
      dispatch(fetchMedications());
      dispatch(fetchDiagnoses());
    }
  }, [dispatch, user]);

  // Format date to readable string
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format time to 12-hour format
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    return `${hour % 12 || 12}:${minutes} ${ampm}`;
  };
  
  // Get status color based on appointment status
  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'NO_SHOW': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get status dot color based on medication status
  const getMedicationStatusColor = (active, endDate) => {
    if (!active) return 'bg-gray-400';
    if (endDate && new Date(endDate) < new Date()) return 'bg-red-500';
    return 'bg-green-500';
  };
  
  // Filter upcoming appointments
  const upcomingAppointments = appointments?.filter(
    app => new Date(app.appointment_date) >= new Date()
  ).sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date));
  
  // Limit displayed appointments
  const displayedAppointments = showAllAppointments 
    ? upcomingAppointments 
    : upcomingAppointments?.slice(0, 3);
  
  // Sort medications by active status and then alphabetically
  const sortedMedications = medications?.sort((a, b) => {
    if (a.active !== b.active) return b.active - a.active;
    return a.name.localeCompare(b.name);
  });
  
  // Limit displayed medications
  const displayedMedications = showAllMedications 
    ? sortedMedications 
    : sortedMedications?.slice(0, 3);
  
  // Get latest vital signs
  const latestVitalSigns = vitalHistory?.[0];
  
  // Get important diagnoses (limited to active ones)
  const activeConditions = diagnoses?.filter(
    diag => diag.status.toLowerCase() === 'active'
  ).slice(0, 3);

  // Handle record click
  const handleRecordClick = (record) => {
    setSelectedRecord(record);
    setShowRecordDetails(true);
  };
  
  // Close record details modal
  const closeRecordDetails = () => {
    setShowRecordDetails(false);
    setSelectedRecord(null);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-8 text-gray-800">Patient Dashboard</h1>
      
      {/* Top Row: Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Upcoming Appointments</p>
              <p className="text-2xl font-bold text-gray-800">{upcomingAppointments?.length || 0}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Active Medications</p>
              <p className="text-2xl font-bold text-gray-800">
                {medications?.filter(med => med.active).length || 0}
              </p>
            </div>
            <Pill className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Medical Records</p>
              <p className="text-2xl font-bold text-gray-800">{medicalRecords?.length || 0}</p>
            </div>
            <FileText className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Active Conditions</p>
              <p className="text-2xl font-bold text-gray-800">
                {diagnoses?.filter(diag => diag.status.toLowerCase() === 'active').length || 0}
              </p>
            </div>
            <Activity className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Appointments */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Upcoming Appointments</h2>
            <button className="text-blue-500 hover:text-blue-700 text-sm">
              Schedule New
            </button>
          </div>
          
          {displayedAppointments?.length > 0 ? (
            <>
              {displayedAppointments.map((appointment, index) => (
                <div 
                  key={index} 
                  className="mb-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800">
                        {appointment.reason}
                      </p>
                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{formatDate(appointment.appointment_date)}</span>
                      </div>
                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{formatTime(appointment.appointment_time)}</span>
                      </div>
                    </div>
                    <div>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(appointment.status)}`}>
                        {appointment.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Dr. {appointment.doctor.user.last_name}
                  </p>
                </div>
              ))}
              
              {upcomingAppointments.length > 3 && (
                <button 
                  className="w-full mt-2 text-sm text-blue-500 hover:text-blue-700 flex items-center justify-center"
                  onClick={() => setShowAllAppointments(!showAllAppointments)}
                >
                  {showAllAppointments ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-1" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-1" />
                      Show All ({upcomingAppointments.length})
                    </>
                  )}
                </button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
              <Calendar className="w-12 h-12 mb-2 opacity-50" />
              <p>No upcoming appointments</p>
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center">
                <Plus className="w-4 h-4 mr-1" />
                Schedule Appointment
              </button>
            </div>
          )}
        </div>
        
        {/* Column 2: Vital Signs & Conditions */}
        <div className="space-y-6">
          {/* Vital Signs Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Latest Vital Signs</h2>
            
            {latestVitalSigns ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Thermometer className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-sm text-gray-600">Temperature</span>
                  </div>
                  <p className="text-xl font-medium mt-1">{latestVitalSigns.temperature}°C</p>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Activity className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="text-sm text-gray-600">Blood Pressure</span>
                  </div>
                  <p className="text-xl font-medium mt-1">
                    {latestVitalSigns.blood_pressure_systolic}/{latestVitalSigns.blood_pressure_diastolic}
                  </p>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Heart className="w-5 h-5 text-pink-500 mr-2" />
                    <span className="text-sm text-gray-600">Heart Rate</span>
                  </div>
                  <p className="text-xl font-medium mt-1">{latestVitalSigns.heart_rate} bpm</p>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Droplet className="w-5 h-5 text-indigo-500 mr-2" />
                    <span className="text-sm text-gray-600">Oxygen</span>
                  </div>
                  <p className="text-xl font-medium mt-1">{latestVitalSigns.oxygen_saturation}%</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center text-gray-500">
                <Activity className="w-12 h-12 mb-2 opacity-50" />
                <p>No vital signs recorded</p>
              </div>
            )}
            
            <div className="text-xs text-gray-500 mt-4 flex justify-between items-center">
              <span>
                {latestVitalSigns ? 
                  `Last recorded: ${new Date(latestVitalSigns.recorded_at).toLocaleDateString()}` : 
                  ''}
              </span>
              <button className="text-blue-500 hover:text-blue-700">View History</button>
            </div>
          </div>
          
          {/* Active Conditions */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Active Conditions</h2>
            
            {activeConditions?.length > 0 ? (
              <div className="space-y-3">
                {activeConditions.map((diagnosis, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{diagnosis.description}</p>
                        <p className="text-xs text-gray-500">ICD: {diagnosis.icd_code}</p>
                      </div>
                      <div className="flex items-start">
                        <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                          {diagnosis.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Diagnosed: {formatDate(diagnosis.diagnosed_date)}
                    </p>
                  </div>
                ))}
                
                {diagnoses?.filter(d => d.status.toLowerCase() === 'active').length > 3 && (
                  <button className="w-full mt-2 text-sm text-blue-500 hover:text-blue-700">
                    View All Conditions
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center text-gray-500">
                <AlertCircle className="w-12 h-12 mb-2 opacity-50" />
                <p>No active conditions</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Column 3: Medications & Records */}
        <div className="space-y-6">
          {/* Medications Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Medications</h2>
              <button className="text-blue-500 hover:text-blue-700 text-sm">
                View Prescriptions
              </button>
            </div>
            
            {displayedMedications?.length > 0 ? (
              <>
                {displayedMedications.map((medication, index) => (
                  <div 
                    key={index}
                    className="mb-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start">
                      <div className={`w-3 h-3 mt-1 mr-3 rounded-full ${getMedicationStatusColor(medication.active, medication.end_date)}`}></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{medication.name}</p>
                        <p className="text-sm text-gray-600">{medication.dosage}, {medication.frequency}</p>
                        <div className="flex flex-wrap text-xs text-gray-500 mt-1">
                          <span className="mr-3">Started: {formatDate(medication.start_date)}</span>
                          {medication.end_date && (
                            <span>Ends: {formatDate(medication.end_date)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {sortedMedications.length > 3 && (
                  <button 
                    className="w-full mt-2 text-sm text-blue-500 hover:text-blue-700 flex items-center justify-center"
                    onClick={() => setShowAllMedications(!showAllMedications)}
                  >
                    {showAllMedications ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-1" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-1" />
                        Show All ({sortedMedications.length})
                      </>
                    )}
                  </button>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center text-gray-500">
                <Pill className="w-12 h-12 mb-2 opacity-50" />
                <p>No medications prescribed</p>
              </div>
            )}
          </div>
          
          {/* Recent Medical Records */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Medical Records</h2>
            
            {medicalRecords?.length > 0 ? (
              <div className="space-y-3">
                {medicalRecords.slice(0, 4).map((record, index) => (
                  <div 
                    key={index} 
                    className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleRecordClick(record)}
                  >
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-gray-800">Dr. {record.doctor.user.last_name}</p>
                      <span className="text-sm text-gray-500">{formatDate(record.date)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-1">{record.diagnosis}</p>
                    <div className="flex justify-end mt-1">
                      <ChevronRight className="w-4 h-4 text-blue-500" />
                    </div>
                  </div>
                ))}
                
                {medicalRecords.length > 4 && (
                  <button className="w-full mt-2 text-sm text-blue-500 hover:text-blue-700">
                    View All Records
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center text-gray-500">
                <FileText className="w-12 h-12 mb-2 opacity-50" />
                <p>No medical records found</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Record Details Modal */}
      <AnimatePresence>
        {showRecordDetails && selectedRecord && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto"
            >
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-xl font-semibold text-gray-800">Medical Record Details</h3>
                <button onClick={closeRecordDetails}>
                  <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="text-gray-800">{formatDate(selectedRecord.date)}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Healthcare Provider</p>
                  <p className="text-gray-800">Dr. {selectedRecord.doctor.user.last_name}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Diagnosis</p>
                  <p className="text-gray-800">{selectedRecord.diagnosis}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Prescription</p>
                  <p className="text-gray-800 whitespace-pre-line">{selectedRecord.prescription}</p>
                </div>
                
                {selectedRecord.notes && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Notes</p>
                    <p className="text-gray-800 whitespace-pre-line">{selectedRecord.notes}</p>
                  </div>
                )}
              </div>
              
              <div className="p-6 border-t bg-gray-50 flex justify-end">
                <button 
                  onClick={closeRecordDetails}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PatientDashboard;