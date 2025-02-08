import React from 'react'
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/layout/layout'
import HomePage from './components/home/home'

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};


function App() {
  //const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Add more routes here as we create them */}
          {/* <Route path="/profile" element={<ProfilePage />} /> */}
          {/* <Route path="/admin" element={<AdminPage />} /> */}
        </Routes>
      </Layout>
    </Router>
    </>
  )
}

export default App
