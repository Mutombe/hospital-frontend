import React from "react";
import { Clock, Calendar, User, Shield, ArrowRight } from "lucide-react";
import { openAuthModal } from "../../redux/slices/authModal";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const features = [
    {
      icon: <Clock className="w-6 h-6 text-blue-600" />,
      title: "24/7 Availability",
      description:
        "Access healthcare services and book appointments anytime, anywhere.",
    },
    {
      icon: <Calendar className="w-6 h-6 text-blue-600" />,
      title: "Easy Scheduling",
      description:
        "Simple and efficient appointment booking system with real-time availability.",
    },
    {
      icon: <User className="w-6 h-6 text-blue-600" />,
      title: "Patient Portal",
      description:
        "Secure access to your medical records and appointment history.",
    },
    {
      icon: <Shield className="w-6 h-6 text-blue-600" />,
      title: "Secure Platform",
      description:
        "Your health information is protected with enterprise-grade security.",
    },
  ];

  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Background */}
      <section className="relative min-h-[90vh] flex items-center justify-center text-center overflow-hidden rounded-sm">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 rounded-sm"
          style={{
            backgroundImage: `url('/flag.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            minHeight: "100vh",
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/85 via-blue-800/75 to-indigo-600/70" />

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/3 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "4s" }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Modern Healthcare
              <br />
              <span className="text-blue-200 bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
                At Your Fingertips
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-50 max-w-3xl mx-auto leading-relaxed opacity-90">
              Experience healthcare management reimagined. Book appointments,
              access records, and connect with healthcare providers seamlessly.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
              {isAuthenticated ? (
                <button
                  className="group bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1 hover:scale-105"
                  onClick={() => navigate("/dashboard")}
                >
                  <span className="flex items-center justify-center">
                    Go to Dashboard
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              ) : (
                <button
                  className="group bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1 hover:scale-105"
                  onClick={() => dispatch(openAuthModal({ mode: "register" }))}
                >
                  <span className="flex items-center justify-center">
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              )}
              <button className="bg-transparent border-2 border-white/80 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 backdrop-blur-sm hover:-translate-y-1 hover:scale-105"
                onClick={() => navigate("/about")}>
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose HealthCare Hub?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the features that make healthcare management simple and
              secure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Healthcare Experience?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of patients who have already simplified their
              healthcare journey with HealthCare Hub.
            </p>
            <button
              className="group bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1 hover:scale-105"
              onClick={() => dispatch(openAuthModal({ mode: "register" }))}
            >
              <span className="flex items-center justify-center">
                Register Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
