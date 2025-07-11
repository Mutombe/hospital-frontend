import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  Hospital,
  Calendar,
  User,
  Bell,
  Settings,
  Search,
  Menu,
  X,
  LogIn,
  LogOut,
  UserPlus,
  Stethoscope,
  BriefcaseMedical,
  Shield,
  Plane,
  Home,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Alert,
  createTheme,
  ThemeProvider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";
import { login, register, logout } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

// Create MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#3b82f6",
    },
    secondary: {
      main: "#60a5fa",
    },
  },
});

const Layout = ({ children }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dispatch = useDispatch();
  
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  // Handle mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && isSidebarOpen && !event.target.closest('.sidebar')) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isSidebarOpen]);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      setIsSidebarOpen(false);
      window.location.reload();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navItems = [
    { 
      icon: <Home className="w-5 h-5" />, 
      label: "Dashboard", 
      href: "/",
      mobileLabel: "Home"
    },
    { 
      icon: <Hospital className="w-5 h-5" />, 
      label: "Patient Dashboard", 
      href: "/patient-dashboard",
      mobileLabel: "Patient"
    },
    { 
      icon: <BriefcaseMedical className="w-5 h-5" />, 
      label: "Doctor's Dashboard", 
      href: "/doctor-dashboard",
      mobileLabel: "Doctor"
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: "Appointments",
      href: "/doctor-appointment",
      mobileLabel: "Appointments"
    },
    { 
      icon: <User className="w-5 h-5" />, 
      label: "Profile", 
      href: "/profile",
      mobileLabel: "Profile"
    },
    {
      icon: <Bell className="w-5 h-5" />,
      label: "Notifications",
      href: "/notifications",
      mobileLabel: "Alerts"
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
      href: "/settings",
      mobileLabel: "Settings"
    },
  ];

  const authNavItems = [
    {
      icon: <LogIn className="w-5 h-5" />,
      label: "Login",
      onClick: () => {
        setIsLoginOpen(true);
        setIsSidebarOpen(false);
      },
      mobileLabel: "Login"
    },
    {
      icon: <UserPlus className="w-5 h-5" />,
      label: "Register",
      onClick: () => {
        setIsRegisterOpen(true);
        setIsSidebarOpen(false);
      },
      mobileLabel: "Sign Up"
    },
  ];

  // Mobile Bottom Navigation
  const MobileBottomNav = () => {
    const bottomNavItems = isAuthenticated ? navItems.slice(0, 4) : authNavItems;
    
    return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-4 h-16">
          {bottomNavItems.map((item, index) => (
            <motion.button
              key={index}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center justify-center p-2 text-gray-600 hover:text-blue-600"
              onClick={item.onClick || (() => {
                if (item.href) window.location.href = item.href;
              })}
            >
              {item.icon}
              <span className="text-xs mt-1 truncate w-full text-center">
                {item.mobileLabel || item.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    );
  };

  // Authentication Modal Content
  const AuthModals = () => {
    const [formData, setFormData] = useState({
      username: "",
      password: "",
      email: "",
      role: "",
      phone: "",
      address: "",
    });
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const { loading } = useSelector((state) => state.auth);

    const handleInputChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async () => {
      try {
        setError(null);
        
        if (!formData.username || !formData.password) {
          throw new Error('Please fill in all fields');
        }
    
        await dispatch(
          login({
            username: formData.username.trim(),
            password: formData.password,
          })
        ).unwrap();
        
        setIsLoginOpen(false);
        setFormData({ username: "", password: "" });
        
      } catch (err) {
        const errorMessage = err.payload?.detail?.[0] || err.message;
        setError(errorMessage);
      }
    };

    const handleRegister = async () => {
      try {
        if (!formData.email || !formData.password || !formData.role) {
          throw new Error('Please fill in all required fields');
        }
        
        await dispatch(register(formData)).unwrap();
        setIsRegisterOpen(false);
        navigate('/check-email');
        setFormData({
          username: "",
          password: "",
          email: "",
        });
      } catch (err) {
        setError(err.payload?.detail || 'Registration failed');
      }
    };

    return (
      <ThemeProvider theme={theme}>
        <Dialog 
          open={isLoginOpen} 
          onClose={() => setIsLoginOpen(false)}
          fullScreen={isMobile}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle 
            style={{ 
              color: "#1e40af",
              textAlign: isMobile ? 'center' : 'left',
              padding: isMobile ? '24px 16px 16px' : '24px'
            }}
          >
            {isMobile && (
              <button
                onClick={() => setIsLoginOpen(false)}
                className="absolute top-4 right-4 p-2"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            Login to MediCare Hub
          </DialogTitle>
          <DialogContent style={{ padding: isMobile ? '0 16px' : '20px 24px' }}>
            {error && (
              <Alert severity="error" className="mb-4">
                {error}
              </Alert>
            )}
            <TextField
              name="username"
              label="Username"
              fullWidth
              margin="normal"
              value={formData.username}
              onChange={handleInputChange}
              InputLabelProps={{ style: { color: "#1e40af" } }}
              variant={isMobile ? "filled" : "outlined"}
            />
            <TextField
              name="password"
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={formData.password}
              onChange={handleInputChange}
              InputLabelProps={{ style: { color: "#1e40af" } }}
              variant={isMobile ? "filled" : "outlined"}
            />
          </DialogContent>
          <DialogActions style={{ padding: isMobile ? '16px' : '24px' }}>
            {!isMobile && (
              <Button onClick={() => setIsLoginOpen(false)} color="secondary">
                Cancel
              </Button>
            )}
            <Button
              onClick={handleLogin}
              color="primary"
              disabled={loading}
              fullWidth={isMobile}
              size={isMobile ? "large" : "medium"}
              style={{ 
                backgroundColor: "#3b82f6", 
                color: "white",
                minHeight: isMobile ? "48px" : "auto"
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </DialogActions>
        </Dialog>
        
        <Dialog 
          open={isRegisterOpen} 
          onClose={() => setIsRegisterOpen(false)}
          fullScreen={isMobile}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle 
            style={{ 
              color: "#1e40af",
              textAlign: isMobile ? 'center' : 'left',
              padding: isMobile ? '24px 16px 16px' : '24px'
            }}
          >
            {isMobile && (
              <button
                onClick={() => setIsRegisterOpen(false)}
                className="absolute top-4 right-4 p-2"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            Create an Account
          </DialogTitle>
          <DialogContent style={{ padding: isMobile ? '0 16px' : '20px 24px' }}>
            {error && (
              <Alert severity="error" className="mb-4">
                {error}
              </Alert>
            )}
            <TextField
              name="email"
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={handleInputChange}
              InputLabelProps={{ style: { color: "#1e40af" } }}
              variant={isMobile ? "filled" : "outlined"}
            />
            <TextField
              name="username"
              label="Username"
              fullWidth
              margin="normal"
              value={formData.username}
              onChange={handleInputChange}
              InputLabelProps={{ style: { color: "#1e40af" } }}
              variant={isMobile ? "filled" : "outlined"}
            />
            <TextField
              name="password"
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={formData.password}
              onChange={handleInputChange}
              InputLabelProps={{ style: { color: "#1e40af" } }}
              variant={isMobile ? "filled" : "outlined"}
            />
            <FormControl fullWidth margin="normal" required variant={isMobile ? "filled" : "outlined"}>
              <InputLabel id="role-label" style={{ color: "#1e40af" }}>
                Select Your Primary Role
              </InputLabel>
              <Select
                labelId="role-label"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                label="Select Your Primary Role"
              >
                <MenuItem value="PATIENT">
                  <Box display="flex" alignItems="center">
                    <User className="w-5 h-5 mr-2" />
                    Patient
                  </Box>
                </MenuItem>
                <MenuItem value="DOCTOR">
                  <Box display="flex" alignItems="center">
                    <Stethoscope className="w-5 h-5 mr-2" />
                    Healthcare Provider
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              Note: You can add additional roles later through your profile settings.
            </Typography>
          </DialogContent>
          <DialogActions style={{ padding: isMobile ? '16px' : '24px' }}>
            {!isMobile && (
              <Button onClick={() => setIsRegisterOpen(false)} color="secondary">
                Cancel
              </Button>
            )}
            <Button
              onClick={handleRegister}
              color="primary"
              disabled={loading}
              fullWidth={isMobile}
              size={isMobile ? "large" : "medium"}
              style={{ 
                backgroundColor: "#3b82f6", 
                color: "white",
                minHeight: isMobile ? "48px" : "auto"
              }}
            >
              {loading ? "Creating account..." : "Register"}
            </Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="flex justify-between items-center h-16 px-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 -ml-2"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex items-center">
            <Hospital className="h-8 w-8 text-blue-600 mr-2" />
            <span className="font-semibold text-lg">MediCare Hub</span>
          </div>
          
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 -mr-2"
          >
            <Search className="h-6 w-6" />
          </button>
        </div>
        
        {/* Mobile Search */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 pb-4"
            >
              <div className="flex items-center bg-gray-100 rounded-lg px-3 py-3">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none focus:ring-0 focus:outline-none ml-2 w-full text-base"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || (!isMobile && window.innerWidth >= 1024)) && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`sidebar fixed left-0 top-0 h-screen bg-white shadow-lg z-40 ${
              isMobile ? 'w-80' : 'w-20 md:w-64'
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
                <a href="/" className="flex items-center">
                  <Hospital className="h-8 w-8 text-blue-600" />
                  <span className={`font-semibold text-lg ml-2 ${isMobile ? 'block' : 'hidden md:block'}`}>
                    MediCare Hub
                  </span>
                </a>
                {isMobile && (
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2"
                  >
                    <X className="h-6 w-6" />
                  </button>
                )}
              </div>

              {/* Military Logos Section */}
              <div className="py-4 px-4 border-b border-gray-200">
                <div className={`flex items-center ${isMobile ? 'justify-start space-x-4' : 'justify-center md:justify-between space-x-2 md:space-x-4'}`}>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-white border border-gray-200">
                      <img 
                        src="/airforce.png" 
                        alt="Air Force Logo" 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-blue-800 rounded-full flex items-center justify-center" style={{display: 'none'}}>
                        <Plane className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <span className={`text-xs font-medium text-gray-700 ${isMobile ? 'block' : 'hidden md:block'}`}>
                      Air Force
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-white">
                      <img 
                        src="/zim.png" 
                        alt="Defense Forces Logo" 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-green-800 rounded-full flex items-center justify-center" style={{display: 'none'}}>
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <span className={`text-xs font-medium text-gray-700 ${isMobile ? 'block' : 'hidden md:block'}`}>
                      Defense Forces
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-1 py-6 space-y-1">
                {isAuthenticated
                  ? navItems.map((item, index) => (
                      <motion.a
                        key={index}
                        href={item.href}
                        whileHover={{ backgroundColor: "#F3F4F6" }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 ${
                          isMobile ? 'min-h-[48px]' : ''
                        }`}
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        <div className={`flex ${isMobile ? 'justify-start' : 'justify-center md:justify-start'} w-full`}>
                          {item.icon}
                          <span className={`ml-3 ${isMobile ? 'block' : 'hidden md:block'}`}>
                            {item.label}
                          </span>
                        </div>
                      </motion.a>
                    ))
                  : authNavItems.map((item, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ backgroundColor: "#F3F4F6" }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-100 ${
                          isMobile ? 'min-h-[48px]' : ''
                        }`}
                        onClick={item.onClick}
                      >
                        <div className={`flex ${isMobile ? 'justify-start' : 'justify-center md:justify-start'} w-full`}>
                          {item.icon}
                          <span className={`ml-3 ${isMobile ? 'block' : 'hidden md:block'}`}>
                            {item.label}
                          </span>
                        </div>
                      </motion.button>
                    ))}
              </div>

              {/* Mobile sidebar footer */}
              {isMobile && isAuthenticated && (
                <div className="border-t border-gray-200 p-4">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"
                    disabled={loading}
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    {loading ? "Logging out..." : "Logout"}
                  </motion.button>
                </div>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay */}
      {isSidebarOpen && isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black z-30"
        />
      )}

      <div className={`flex-1 ${!isMobile ? 'lg:ml-64' : ''}`}>
        {/* Desktop Top Navigation */}
        <nav className="hidden md:block bg-white shadow-sm sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="hidden lg:flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-800 rounded-full flex items-center justify-center">
                    <Plane className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Air Force Medical</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-green-800 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Defense Health Services</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
                  <Search className="h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="bg-transparent border-none focus:ring-0 focus:outline-none ml-2 w-full"
                  />
                </div>
                {isAuthenticated ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
                    disabled={loading}
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    {loading ? "Logging out..." : "Logout"}
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsRegisterOpen(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Register
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className={`${isMobile ? 'pt-16 pb-20' : ''}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
        
        {/* Footer */}
        <footer className={`bg-white shadow-inner ${isMobile ? 'pb-20' : ''}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">MediCare Hub</h3>
                <p className="text-gray-600 text-sm">
                  Providing quality healthcare services for military personnel and defense forces.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Military Health</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-center">
                    <Plane className="w-4 h-4 mr-2 text-blue-800" />
                    Air Force Medical
                  </li>
                  <li className="flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-green-800" />
                    Defense Health Services
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>
                    <a href="/" className="hover:text-blue-600">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="/" className="hover:text-blue-600">
                      Services
                    </a>
                  </li>
                  <li>
                    <a href="/" className="hover:text-blue-600">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                <p className="text-gray-600 text-sm">
                  Military Medical Center
                  <br />
                  Defense Health District
                  <br />
                  contact@defensehealthcare.mil
                </p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t text-center text-gray-600 text-sm">
              <p>&copy; 2025 MediCare Hub - Defense Health Services. All rights reserved.</p>
            </div>
          </div>
        </footer>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />

        {/* Authentication Modals */}
        <AuthModals />
      </div>
    </div>
  );
};

export default Layout;