import React from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Calendar, 
  User, 
  Shield,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const features = [
    {
      icon: <Clock className="w-6 h-6 text-blue-600" />,
      title: '24/7 Availability',
      description: 'Access healthcare services and book appointments anytime, anywhere.'
    },
    {
      icon: <Calendar className="w-6 h-6 text-blue-600" />,
      title: 'Easy Scheduling',
      description: 'Simple and efficient appointment booking system with real-time availability.'
    },
    {
      icon: <User className="w-6 h-6 text-blue-600" />,
      title: 'Patient Portal',
      description: 'Secure access to your medical records and appointment history.'
    },
    {
      icon: <Shield className="w-6 h-6 text-blue-600" />,
      title: 'Secure Platform',
      description: 'Your health information is protected with enterprise-grade security.'
    }
  ];

  const { isAuthenticated } = JSON.parse(localStorage.getItem('auth')) || { isAuthenticated: false };
  const navigate = useNavigate();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-8"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
          Modern Healthcare<br />
          <span className="text-blue-600">At Your Fingertips</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Experience healthcare management reimagined. Book appointments, access records, and connect with healthcare providers seamlessly.
        </p>
        <div className="flex justify-center space-x-4">
          {isAuthenticated ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/patient-dashboard')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium"
            >
              Go to Dashboard
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium"
            >
              Get Started
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gray-100 text-gray-900 px-8 py-3 rounded-lg font-medium"
          >
            Learn More
          </motion.button>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-blue-600 text-white rounded-2xl p-8 md:p-12"
      >
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Transform Your Healthcare Experience?</h2>
          <p className="text-blue-100 text-lg">
            Join thousands of patients who have already simplified their healthcare journey with HealthCare Hub.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium inline-flex items-center group"
          >
            Register Now
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;