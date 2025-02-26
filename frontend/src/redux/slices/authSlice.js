// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import axios from "axios";

const BASE_URL = "http://localhost:8000/api";

// Async thunks

export const initializeAuth = createAsyncThunk(
  "auth/initialize",
  async (_, { dispatch }) => {
    const tokens = JSON.parse(localStorage.getItem("tokens"));
    if (!tokens) return null;

    try {
      // Verify token validity
      await dispatch(refreshToken(tokens.refresh)).unwrap();
      return tokens;
    } catch (error) {
      localStorage.removeItem("tokens");
      return null;
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post(`/login/`, credentials, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.data.access) {
        throw new Error('Invalid server response');
      }
      
      localStorage.setItem("tokens", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { detail: "Login failed" });
    }
  }
);

export const register1 = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post(`${BASE_URL}/register/`, userData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
      console.log("User Registration Data", userData)
      console.log("Registration Response", response.data);
      return response.data;
      
    } catch (error) {
      return rejectWithValue(error.response.data || 'Registration failed');
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/register/`, userData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { detail: 'Registration failed' }
      );
    }
  }
);

// Modified logout thunk
export const logout1 = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      //const { tokens } = getState().auth;
      const tokens = localStorage.getItem("tokens")
      
      await axios.post(
        `${BASE_URL}/logout/`, 
        { refresh_token: tokens.refresh },
        {
          headers: {
            'Authorization': `Bearer ${tokens.access}`,
            'Content-Type': 'application/json',
          }
        }
      );
      
      localStorage.removeItem("tokens");
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Logout failed');
    }
  }
);

// Updated logout thunk in authSlice.js
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const tokens = JSON.parse(localStorage.getItem("tokens")); // Parse JSON
      
      if (!tokens?.refresh) {
        throw new Error("No refresh token available");
      }

      await axios.post(
        `${BASE_URL}/logout/`, 
        { refresh: tokens.refresh },  // Match backend expectation
        {
          headers: {
            'Authorization': `Bearer ${tokens.access}`,
            'Content-Type': 'application/json',
          }
        }
      );
      
      localStorage.removeItem("tokens");
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Logout failed');
    }
  }
);

// Modified refresh token thunk
export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (refresh, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/token/refresh/`, {
        refresh,
      });
      const newTokens = { ...response.data };
      localStorage.setItem("tokens", JSON.stringify(newTokens));
      return newTokens;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  user: null,
  tokens: JSON.parse(localStorage.getItem("tokens")) || null,
  isAuthenticated: !!localStorage.getItem("tokens"),
  loading: true,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.tokens = action.payload;
        state.user = {
          id: action.payload.user_id,
          role: action.payload.role,
          patientId: action.payload.patient_id,
          doctorId: action.payload.doctor_id,
        };
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.detail || 'Login failed. Please check your credentials.';
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.tokens = null;
        state.isAuthenticated = false;
      })
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
      })
      // Refresh Token
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.tokens = action.payload;
      });
  },
});

export const { clearError, setError } = authSlice.actions;
export default authSlice.reducer;
