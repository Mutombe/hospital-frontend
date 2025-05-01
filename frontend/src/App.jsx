import React from "react";
import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Layout from "./components/layout/layout";
import HomePage from "./components/home/home";
import VerifyEmailPage from "./components/auth/verify_email";
import { CheckEmailPage } from "./components/auth/verify_email";
import { VerifyEmailHandler } from "./components/auth/verify_email";
import DoctorAppointmentBooking from "./components/dashboard/appointment";
import PatientDashboard from "./components/dashboard/patientDashboard";
import DoctorDashboard from "./components/dashboard/doctorsDashboard";
import ProfilePage from "./components/auth/profile";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/check-email" element={<CheckEmailPage />} />
            <Route
              path="/verify-email/:uidb64/:token"
              element={<VerifyEmailHandler />}
            />
            {/* Add more routes here as we create them */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/patient-dashboard" element={<PatientDashboard />} />
            <Route path="/doctor-appointment" element={<DoctorAppointmentBooking />} />
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            {/* <Route path="/admin" element={<AdminPage />} /> */}
          </Routes>
        </Layout>
      </Router>
    </>
  );
}

export default App;
