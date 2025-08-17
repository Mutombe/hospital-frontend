// src/pages/About.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  Hospital,
  Shield,
  Plane,
  Users,
  HeartPulse,
  Stethoscope,
  BriefcaseMedical,
  CalendarCheck,
  ClipboardList,
  Lock,
  Smartphone,
} from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-r from-blue-800 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1920')] bg-cover bg-center"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Hospital className="w-16 h-16 mx-auto mb-6" />
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                About Airforce of Zimbabwe HealthNet.
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Serving those who serve our nation with dedicated healthcare
                solutions
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-xl text-gray-700">
                To provide military personnel and their families with
                accessible, secure, and comprehensive healthcare services
                through innovative digital solutions.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <motion.div
              className="bg-blue-50 rounded-2xl p-8 shadow-lg"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center mb-6">
                <Shield className="w-12 h-12 text-blue-700 mr-4" />
                <h3 className="text-2xl font-bold text-gray-900">
                  Defense Health Services
                </h3>
              </div>
              <p className="text-gray-700 mb-6">
                Dedicated to serving active-duty personnel, veterans, and their
                families with specialized healthcare solutions tailored to the
                unique challenges of military life.
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <HeartPulse className="w-5 h-5 text-blue-700" />
                </div>
                <span>Comprehensive care coordination</span>
              </div>
            </motion.div>

            <motion.div
              className="bg-indigo-50 rounded-2xl p-8 shadow-lg"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center mb-6">
                <Plane className="w-12 h-12 text-indigo-700 mr-4" />
                <h3 className="text-2xl font-bold text-gray-900">
                  Air Force Medical
                </h3>
              </div>
              <p className="text-gray-700 mb-6">
                Providing specialized care for Air Force personnel stationed
                around the globe, with telemedicine capabilities for remote
                locations.
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                  <BriefcaseMedical className="w-5 h-5 text-indigo-700" />
                </div>
                <span>Specialized aviation medicine</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Platform Features
              </h2>
              <p className="text-xl text-gray-700">
                Designed to meet the unique needs of military healthcare
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-700">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Military Health Services */}
      <section className="py-20 bg-gradient-to-r from-blue-800 to-indigo-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Military Health Services
              </h2>
              <p className="text-xl opacity-90">
                Serving the unique healthcare needs of our armed forces
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <motion.div
              className="bg-white backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-blue-700 flex items-center justify-center mr-4">
                  <Plane className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Air Force Medical
                </h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 font-semibold">•</span>
                  <span className="text-gray-700">
                    Specialized aviation medicine for pilots and flight crew
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 font-semibold">•</span>
                  <span className="text-gray-700">
                    Deployment health assessments and tracking
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 font-semibold">•</span>
                  <span className="text-gray-700">
                    High-altitude physiology consultations
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 font-semibold">•</span>
                  <span className="text-gray-700">
                    Remote telemedicine for stationed personnel
                  </span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              className="bg-white backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-indigo-700 flex items-center justify-center mr-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Defense Health Services
                </h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-3 font-semibold">•</span>
                  <span className="text-gray-700">
                    Combat trauma and rehabilitation services
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-3 font-semibold">•</span>
                  <span className="text-gray-700">
                    Mental health and PTSD support programs
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-3 font-semibold">•</span>
                  <span className="text-gray-700">
                    Family healthcare services for dependents
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-3 font-semibold">•</span>
                  <span className="text-gray-700">
                    Veterans transition healthcare programs
                  </span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      

      {/* Security Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center max-w-6xl mx-auto">
            <motion.div
              className="md:w-1/2 mb-12 md:mb-0 md:pr-12"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white border-2 border-gray-300 border-dashed rounded-xl w-full h-96 flex items-center justify-center">
                <span className="text-gray-500 text-lg font-medium">
                  Security Visualization
                </span>
              </div>
            </motion.div>

            <motion.div
              className="md:w-1/2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-6">
                <Lock className="w-6 h-6 text-blue-700" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Military-Grade Security
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Your health data is protected with the highest security
                standards, meeting all military compliance requirements.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 font-semibold">✓</span>
                  <span className="text-gray-700">
                    End-to-end encryption of all health records
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 font-semibold">✓</span>
                  <span className="text-gray-700">
                    Multi-factor authentication for all users
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 font-semibold">✓</span>
                  <span className="text-gray-700">
                    Regular security audits and penetration testing
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 font-semibold">✓</span>
                  <span className="text-gray-700">
                    Compliance with military healthcare regulations
                  </span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Join Our Healthcare Community
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Whether you're active duty, a veteran, or a family member,
                Airforce of Zimbabwe HealthNet is here to serve your healthcare needs.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-blue-700 font-bold rounded-lg shadow-lg"
                >
                  Create Account
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg"
                >
                  Contact Support
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Feature data
const features = [
  {
    icon: Stethoscope,
    title: "Virtual Consultations",
    description:
      "Connect with military healthcare providers from anywhere in the world via secure video calls.",
  },
  {
    icon: ClipboardList,
    title: "Health Records",
    description:
      "Access your complete medical history, including service-related health documentation.",
  },
  {
    icon: CalendarCheck,
    title: "Appointment Management",
    description:
      "Schedule, reschedule, or cancel appointments with military medical facilities.",
  },
  {
    icon: HeartPulse,
    title: "Health Monitoring",
    description:
      "Track vital signs and health metrics with integration to military-issued devices.",
  },
  {
    icon: Smartphone,
    title: "Mobile Access",
    description:
      "Full platform functionality available on your smartphone for healthcare on the go.",
  },
  {
    icon: Users,
    title: "Family Care",
    description:
      "Manage healthcare for your entire family through a single account.",
  },
];

export default About;
