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
            {/* <Route path="/profile" element={<ProfilePage />} /> */}
            {/* <Route path="/admin" element={<AdminPage />} /> */}
          </Routes>
        </Layout>
      </Router>
    </>
  );
}

export default App;
