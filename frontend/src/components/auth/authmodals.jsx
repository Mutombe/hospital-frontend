import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Hospital,
  User,
  Stethoscope,
  BriefcaseMedical
} from 'lucide-react';
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
  Typography
} from '@mui/material';
import { login, register, logout } from './authSlice';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3b82f6',
    },
    secondary: {
      main: '#60a5fa',
    },
  },
});

const AuthModals = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    role: '',
    phone: '',
    address: ''
  });

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      await dispatch(login({
        username: formData.username,
        password: formData.password
      })).unwrap();
      setIsLoginOpen(false);
      setFormData({ username: '', password: '', email: '', role: '', phone: '', address: '' });
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleRegister = async () => {
    try {
      await dispatch(register(formData)).unwrap();
      setIsRegisterOpen(false);
      setFormData({ username: '', password: '', email: '', role: '', phone: '', address: '' });
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {/* Login Dialog */}
      <Dialog open={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
        <DialogTitle style={{ color: '#1e40af' }}>Airforce of Zimbabwe HealthNet.</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" className="mb-4">{error}</Alert>}
          <TextField
            name="username"
            label="Username"
            fullWidth
            margin="normal"
            value={formData.username}
            onChange={handleInputChange}
            InputLabelProps={{ style: { color: '#1e40af' } }}
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={handleInputChange}
            InputLabelProps={{ style: { color: '#1e40af' } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsLoginOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleLogin}
            color="primary"
            disabled={loading}
            style={{ backgroundColor: '#3b82f6', color: 'white' }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Registration Dialog */}
      <Dialog open={isRegisterOpen} onClose={() => setIsRegisterOpen(false)}>
        <DialogTitle style={{ color: '#1e40af' }}>Create an Account</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" className="mb-4">{error}</Alert>}
          <TextField
            name="email"
            label="Email"
            type="email"
            fullWidth
            required
            margin="normal"
            value={formData.email}
            onChange={handleInputChange}
            InputLabelProps={{ style: { color: '#1e40af' } }}
          />
          <TextField
            name="username"
            label="Username"
            fullWidth
            required
            margin="normal"
            value={formData.username}
            onChange={handleInputChange}
            InputLabelProps={{ style: { color: '#1e40af' } }}
          />
          
          <TextField
            name="password"
            label="Password"
            type="password"
            fullWidth
            required
            margin="normal"
            value={formData.password}
            onChange={handleInputChange}
            InputLabelProps={{ style: { color: '#1e40af' } }}
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="role-label" style={{ color: '#1e40af' }}>Select Your Primary Role</InputLabel>
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
          <TextField
            name="phone"
            label="Phone"
            fullWidth
            required
            margin="normal"
            value={formData.phone}
            onChange={handleInputChange}
            InputLabelProps={{ style: { color: '#1e40af' } }}
          />
          <TextField
            name="address"
            label="Address"
            fullWidth
            required
            margin="normal"
            value={formData.address}
            onChange={handleInputChange}
            InputLabelProps={{ style: { color: '#1e40af' } }}
            multiline
            rows={2}
          />
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            Note: You can add additional roles later through your profile settings.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsRegisterOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleRegister}
            color="primary"
            disabled={loading}
            style={{ backgroundColor: '#3b82f6', color: 'white' }}
          >
            {loading ? 'Creating account...' : 'Register'}
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

// Updated Layout Component
const Layout = ({ children }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const navItems = [
    { icon: <Hospital className="w-5 h-5" />, label: "Dashboard", href: "/" },
    { icon: <Hospital className="w-5 h-5" />, label: "Patient Dashboard", href: "/patient-dashboard" },
    { icon: <BriefcaseMedical className="w-5 h-5" />, label: "Doctor's Dashboard", href: "/doctors-dashboard" },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: "Appointments",
      href: "/appointments",
    },
    { icon: <User className="w-5 h-5" />, label: "Profile", href: "/profile" },
    {
      icon: <Bell className="w-5 h-5" />,
      label: "Notifications",
      href: "/notifications",
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
      href: "/settings",
    },
  ];

  const authNavItems = [
    {
      icon: <LogIn className="w-5 h-5" />,
      label: "Login",
      onClick: () => setIsLoginOpen(true)
    },
    {
      icon: <UserPlus className="w-5 h-5" />,
      label: "Register",
      onClick: () => setIsRegisterOpen(true)
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden"
      >
        {isSidebarOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <div className="flex items-center space-x-2">
            <Menu className="h-6 w-6" />
            <Hospital className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
          </div>
        )}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth >= 1024) && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 h-screen w-20 md:w-64 bg-white shadow-lg z-40"
          >
            <div className="flex flex-col h-full">
              <div className="h-16 flex items-center justify-center md:justify-start px-4">
                <span className="font-semibold text-lg hidden md:block ml-2">
                   HealthNet.
                </span>
              </div>
              <div className="flex-1 py-6 space-y-1">
                {isAuthenticated ? (
                  navItems.map((item, index) => (
                    <motion.a
                      key={index}
                      href={item.href}
                      whileHover={{ backgroundColor: "#F3F4F6" }}
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <div className="flex justify-center md:justify-start w-full">
                        {item.icon}
                        <span className="ml-3 hidden md:block">{item.label}</span>
                      </div>
                    </motion.a>
                  ))
                ) : (
                  authNavItems.map((item, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ backgroundColor: "#F3F4F6" }}
                      className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-100"
                      onClick={item.onClick}
                    >
                      <div className="flex justify-center md:justify-start w-full">
                        {item.icon}
                        <span className="ml-3 hidden md:block">{item.label}</span>
                      </div>
                    </motion.button>
                  ))
                )}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay */}
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black lg:hidden z-30"
        />
      )}

      <div className="flex-1 lg:ml-64">
        {/* Top Navigation */}
        <nav className="bg-white shadow-sm sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-end h-16">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="md:hidden p-2"
                >
                  <Search className="h-5 w-5" />
                </button>
                <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2">
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
                    {loading ? 'Logging out...' : 'Logout'}
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsRegisterOpen(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Register Now
                  </motion.button>
                )}
              </div>
            </div>

            {/* Mobile Search */}
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="md:hidden pb-4"
                >
                  <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
                    <Search className="h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="bg-transparent border-none focus:ring-0 focus:outline-none ml-2 w-full"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Main Content */}
        <main>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>

        {/* Authentication Modals */}
        <AuthModals />
      </div>
    </div>
  );
};

export default Layout;