import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Calendar,
  Clock,
  User,
  Activity,
  Pill,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Search,
} from "lucide-react";
import { format, isToday, isThisWeek } from "date-fns";

const DoctorDashboard = () => {
  const dispatch = useDispatch();
  const { appointments, patients, medicalRecords } = useSelector(
    (state) => state.doctor
  );
  const { user } = useSelector((state) => state.auth);

  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingPatient, setViewingPatient] = useState(null);
  const [selectedTab, setSelectedTab] = useState("overview");

  // Simulated data fetch on component mount
  useEffect(() => {
    // In a real application, you would dispatch actions to fetch the data
    // dispatch(fetchAppointments());
    // dispatch(fetchPatients());
    // dispatch(fetchMedicalRecords());
  }, [dispatch]);

  const todaysAppointments =
    appointments?.filter((app) => isToday(new Date(app.appointment_date))) ||
    [];

  const upcomingAppointments =
    appointments?.filter(
      (app) =>
        !isToday(new Date(app.appointment_date)) &&
        isThisWeek(new Date(app.appointment_date)) &&
        app.status !== "COMPLETED" &&
        app.status !== "CANCELLED"
    ) || [];

  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      case "NO_SHOW":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredPatients =
    patients?.filter((patient) => {
      const matchesSearch =
        patient.user.username
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (patient.mrn &&
          patient.mrn.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesSearch;
    }) || [];

  const getPatientVitals = (patientId) => {
    // This would typically come from the Redux store
    return {
      temperature: "98.6",
      bloodPressure: "120/80",
      heartRate: "72",
      oxygenSaturation: "98",
    };
  };

  const renderPatientDetails = () => {
    if (!viewingPatient) return null;

    const patientVitals = getPatientVitals(viewingPatient.id);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">
                Patient Details
              </h2>
              <button
                onClick={() => setViewingPatient(null)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <XCircle className="w-6 h-6 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row md:space-x-6">
              <div className="md:w-1/3 mb-6 md:mb-0">
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold text-lg text-blue-800 mb-2">
                    Patient Information
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {viewingPatient.user.username}
                    </p>
                    <p>
                      <span className="font-medium">MRN:</span>{" "}
                      {viewingPatient.mrn || "Not assigned"}
                    </p>
                    <p>
                      <span className="font-medium">DOB:</span>{" "}
                      {format(new Date(viewingPatient.date_of_birth), "PP")}
                    </p>
                    <p>
                      <span className="font-medium">Gender:</span>{" "}
                      {viewingPatient.gender === "M"
                        ? "Male"
                        : viewingPatient.gender === "F"
                        ? "Female"
                        : "Other"}
                    </p>
                    <p>
                      <span className="font-medium">Blood Type:</span>{" "}
                      {viewingPatient.blood_type}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {viewingPatient.phone}
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg text-green-800 mb-2">
                    Latest Vitals
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Temperature:</span>{" "}
                      {patientVitals.temperature}°F
                    </p>
                    <p>
                      <span className="font-medium">BP:</span>{" "}
                      {patientVitals.bloodPressure} mmHg
                    </p>
                    <p>
                      <span className="font-medium">Heart Rate:</span>{" "}
                      {patientVitals.heartRate} bpm
                    </p>
                    <p>
                      <span className="font-medium">O2 Sat:</span>{" "}
                      {patientVitals.oxygenSaturation}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="md:w-2/3">
                <div className="flex border-b mb-4">
                  <button
                    className={`py-2 px-4 ${
                      selectedTab === "overview"
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-gray-500"
                    }`}
                    onClick={() => setSelectedTab("overview")}
                  >
                    Overview
                  </button>
                  <button
                    className={`py-2 px-4 ${
                      selectedTab === "appointments"
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-gray-500"
                    }`}
                    onClick={() => setSelectedTab("appointments")}
                  >
                    Appointments
                  </button>
                  <button
                    className={`py-2 px-4 ${
                      selectedTab === "records"
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-gray-500"
                    }`}
                    onClick={() => setSelectedTab("records")}
                  >
                    Medical Records
                  </button>
                </div>

                {selectedTab === "overview" && (
                  <div className="space-y-4">
                    <div className="bg-white border rounded-lg p-4">
                      <h3 className="font-semibold text-lg mb-2">
                        Active Medications
                      </h3>
                      {viewingPatient.medications?.filter((med) => med.active)
                        .length > 0 ? (
                        <ul className="space-y-2">
                          {viewingPatient.medications
                            ?.filter((med) => med.active)
                            .map((med) => (
                              <li key={med.id} className="flex items-start">
                                <Pill className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
                                <div>
                                  <p className="font-medium">{med.name}</p>
                                  <p className="text-sm text-gray-600">
                                    {med.dosage}, {med.frequency}
                                  </p>
                                </div>
                              </li>
                            ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 italic">
                          No active medications
                        </p>
                      )}
                    </div>

                    <div className="bg-white border rounded-lg p-4">
                      <h3 className="font-semibold text-lg mb-2">
                        Current Diagnoses
                      </h3>
                      {viewingPatient.diagnoses?.filter(
                        (diag) => diag.status === "ACTIVE"
                      ).length > 0 ? (
                        <ul className="space-y-2">
                          {viewingPatient.diagnoses
                            ?.filter((diag) => diag.status === "ACTIVE")
                            .map((diag) => (
                              <li key={diag.id} className="flex items-start">
                                <FileText className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
                                <div>
                                  <p className="font-medium">
                                    {diag.description}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    ICD: {diag.icd_code}
                                  </p>
                                </div>
                              </li>
                            ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 italic">
                          No active diagnoses
                        </p>
                      )}
                    </div>

                    <div className="bg-white border rounded-lg p-4">
                      <h3 className="font-semibold text-lg mb-2">
                        Last Visit Notes
                      </h3>
                      {viewingPatient.lastVisit ? (
                        <div>
                          <p className="text-sm text-gray-600 mb-2">
                            {format(
                              new Date(viewingPatient.lastVisit.date),
                              "PPP"
                            )}
                          </p>
                          <p>{viewingPatient.lastVisit.notes}</p>
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">
                          No previous visit records
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {selectedTab === "appointments" && (
                  <div className="space-y-4">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-semibold text-lg">
                        Appointment History
                      </h3>
                    </div>

                    {viewingPatient.appointments?.length > 0 ? (
                      <div className="space-y-3">
                        {viewingPatient.appointments.map((app) => (
                          <div
                            key={app.id}
                            className="border rounded-lg p-3 hover:bg-gray-50"
                          >
                            <div className="flex justify-between">
                              <div className="flex items-center">
                                <Calendar className="w-5 h-5 text-blue-500 mr-2" />
                                <span>
                                  {format(new Date(app.appointment_date), "PP")}
                                </span>
                              </div>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                                  app.status
                                )}`}
                              >
                                {app.status}
                              </span>
                            </div>
                            <p className="mt-2">
                              <span className="font-medium">Reason:</span>{" "}
                              {app.reason}
                            </p>
                            {app.notes && (
                              <p className="mt-1 text-gray-600">{app.notes}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">
                        No appointment history
                      </p>
                    )}

                    <button className="w-full py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                      Schedule New Appointment
                    </button>
                  </div>
                )}

                {selectedTab === "records" && (
                  <div className="space-y-4">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-semibold text-lg">Medical Records</h3>
                    </div>

                    {viewingPatient.medicalRecords?.length > 0 ? (
                      <div className="space-y-3">
                        {viewingPatient.medicalRecords.map((record) => (
                          <div
                            key={record.id}
                            className="border rounded-lg p-3 hover:bg-gray-50"
                          >
                            <div className="flex justify-between mb-2">
                              <span className="font-medium">
                                {format(new Date(record.date), "PP")}
                              </span>
                            </div>
                            <p>
                              <span className="font-medium">Diagnosis:</span>{" "}
                              {record.diagnosis}
                            </p>
                            <p className="mt-1">
                              <span className="font-medium">Prescription:</span>{" "}
                              {record.prescription}
                            </p>
                            {record.notes && (
                              <p className="mt-1 text-gray-600">
                                {record.notes}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">
                        No medical records found
                      </p>
                    )}

                    <button className="w-full py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                      Add New Record
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 border-t flex justify-end">
            <button
              onClick={() => setViewingPatient(null)}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 mr-2"
            >
              Close
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Update Patient
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Doctor Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search patients..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold ml-3">Today's Schedule</h2>
          </div>
          <div className="text-3xl font-bold">{todaysAppointments.length}</div>
          <div className="text-gray-500 mb-4">appointments scheduled</div>
          <div className="flex justify-between text-sm mb-2">
            <span>Status</span>
            <div className="flex space-x-2">
              <span className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-green-500 mr-1"></span>
                {
                  todaysAppointments.filter((a) => a.status === "CONFIRMED")
                    .length
                }{" "}
                confirmed
              </span>
              <span className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-yellow-500 mr-1"></span>
                {
                  todaysAppointments.filter((a) => a.status === "PENDING")
                    .length
                }{" "}
                pending
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${(todaysAppointments.length / 10) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <User className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold ml-3">My Patients</h2>
          </div>
          <div className="text-3xl font-bold">{patients?.length || 0}</div>
          <div className="text-gray-500 mb-4">total patients</div>
          <div className="flex justify-between text-sm mb-2">
            <span>Gender</span>
            <div className="flex space-x-2">
              <span className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-blue-500 mr-1"></span>
                {patients?.filter((p) => p.gender === "M").length || 0} male
              </span>
              <span className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-pink-500 mr-1"></span>
                {patients?.filter((p) => p.gender === "F").length || 0} female
              </span>
              <span className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-purple-500 mr-1"></span>
                {patients?.filter((p) => p.gender === "O").length || 0} other
              </span>
            </div>
          </div>
          <div className="w-full flex h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-500 h-2.5"
              style={{
                width: `${
                  (patients?.filter((p) => p.gender === "M").length /
                    (patients?.length || 1)) *
                  100
                }%`,
              }}
            ></div>
            <div
              className="bg-pink-500 h-2.5"
              style={{
                width: `${
                  (patients?.filter((p) => p.gender === "F").length /
                    (patients?.length || 1)) *
                  100
                }%`,
              }}
            ></div>
            <div
              className="bg-purple-500 h-2.5"
              style={{
                width: `${
                  (patients?.filter((p) => p.gender === "O").length /
                    (patients?.length || 1)) *
                  100
                }%`,
              }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold ml-3">Performance</h2>
          </div>
          <div className="text-3xl font-bold">
            {appointments?.filter((a) => a.status === "COMPLETED").length || 0}
          </div>
          <div className="text-gray-500 mb-4">completed appointments</div>
          <div className="flex justify-between text-sm mb-2">
            <span>Satisfaction Rate</span>
            <span>94%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-purple-600 h-2.5 rounded-full"
              style={{ width: "94%" }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Today's Appointments</h2>
            <div className="flex space-x-2">
              <button
                className={`px-2 py-1 rounded-lg text-sm ${
                  filterStatus === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
                onClick={() => setFilterStatus("all")}
              >
                All
              </button>
              <button
                className={`px-2 py-1 rounded-lg text-sm ${
                  filterStatus === "confirmed"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
                onClick={() => setFilterStatus("confirmed")}
              >
                Confirmed
              </button>
              <button
                className={`px-2 py-1 rounded-lg text-sm ${
                  filterStatus === "pending"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
                onClick={() => setFilterStatus("pending")}
              >
                Pending
              </button>
            </div>
          </div>

          {todaysAppointments.length > 0 ? (
            <div className="space-y-4">
              {todaysAppointments
                .filter(
                  (app) =>
                    filterStatus === "all" ||
                    app.status.toLowerCase() === filterStatus
                )
                .map((appointment, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Clock className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">
                          {appointment.patient?.user?.username ||
                            "Patient Name"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format(
                            new Date(
                              appointment.appointment_date +
                                "T" +
                                appointment.appointment_time
                            ),
                            "h:mm a"
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status}
                      </span>
                      <button className="text-gray-500 hover:text-gray-700">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <Calendar className="h-12 w-12" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No appointments today
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                You have a clear schedule for today.
              </p>
            </div>
          )}

          {todaysAppointments.length > 0 && (
            <button className="mt-4 w-full py-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
              View all appointments
            </button>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Patient List</h2>
          </div>

          {filteredPatients.length > 0 ? (
            <div className="space-y-4">
              {filteredPatients.slice(0, 5).map((patient, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => setViewingPatient(patient)}
                >
                  <div className="flex items-center">
                    <div className="bg-gray-200 h-10 w-10 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">{patient.user.username}</p>
                      <p className="text-sm text-gray-500">
                        {patient.gender === "M"
                          ? "Male"
                          : patient.gender === "F"
                          ? "Female"
                          : "Other"}
                        ,{" "}
                        {new Date().getFullYear() -
                          new Date(patient.date_of_birth).getFullYear()}{" "}
                        years
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">
                      MRN: {patient.mrn || "N/A"}
                    </span>
                    <button className="text-blue-600 hover:text-blue-800">
                      <FileText className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <User className="h-12 w-12" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No patients found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search criteria.
              </p>
            </div>
          )}

          {filteredPatients.length > 5 && (
            <button className="mt-4 w-full py-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
              View all patients ({filteredPatients.length})
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-6">Upcoming Appointments</h2>

        {upcomingAppointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Patient
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date & Time
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Purpose
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {upcomingAppointments.map((appointment, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.patient?.user?.username ||
                              "Patient Name"}
                          </div>
                          <div className="text-sm text-gray-500">
                            MRN: {appointment.patient?.mrn || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {format(new Date(appointment.appointment_date), "PPP")}
                      </div>
                      <div className="text-sm text-gray-500">
                        {format(
                          new Date(
                            appointment.appointment_date +
                              "T" +
                              appointment.appointment_time
                          ),
                          "h:mm a"
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {appointment.reason}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        <CheckCircle className="h-5 w-5" />
                      </button>
                      <button className="text-red-600 hover:text-red-900 mr-3">
                        <XCircle className="h-5 w-5" />
                      </button>
                      <button className="text-yellow-600 hover:text-yellow-900">
                        <AlertCircle className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <Calendar className="h-12 w-12" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No upcoming appointments
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Create a new appointment to see it here.
            </p>
            <div className="mt-6">
              <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Schedule Appointment
              </button>
            </div>
          </div>
        )}
      </div>

      {renderPatientDetails()}
    </div>
  );
};

export default DoctorDashboard;
