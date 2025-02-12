// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import axios from "axios";

const BASE_URL = "http://localhost:8000/api";

// Async thunks
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post(`/login/`, credentials);
      localStorage.setItem("tokens", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/register/`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Modified logout thunk
export const logout = createAsyncThunk(
  "auth/logout",
  async (refresh_token, { rejectWithValue }) => {
    try {
      await axios.post(`${BASE_URL}/logout/`, { refresh_token });
      localStorage.removeItem("tokens");
      return null;
    } catch (error) {
      return rejectWithValue(error.response.data);
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
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
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
        state.error = action.payload;
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
      // Refresh Token
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.tokens = action.payload;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
