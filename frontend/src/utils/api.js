import axios from "axios";

const api = axios.create({
  baseURL: 'https://hospital-pf5g.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
  // Remove CSRF configuration - not needed for JWT
});

// Add request interceptor for JWT auth token
api.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem('auth') || '{}')?.access;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const authData = JSON.parse(localStorage.getItem('auth') || '{}');
      const refreshToken = authData.refresh;
      
      if (refreshToken) {
        try {
          const response = await axios.post('https://hospital-pf5g.onrender.com/api/token/refresh/', {
            refresh: refreshToken
          });
          
          const newAccessToken = response.data.access;
          
          // Update stored auth data
          const updatedAuthData = {
            ...authData,
            access: newAccessToken
          };
          localStorage.setItem('auth', JSON.stringify(updatedAuthData));
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
          
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          localStorage.removeItem('auth');
          // You might want to dispatch a logout action here
          return Promise.reject(refreshError);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;