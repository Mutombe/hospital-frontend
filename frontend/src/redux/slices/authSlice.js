// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createAction } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("login/", credentials);
      return {
        access: response.data.access,
        refresh: response.data.refresh,
        user: {
          id: response.data.user_id,
          username: response.data.username,
          email: response.data.email,
          role: response.data.role,
          profile_complete: response.data.profile_complete,
        },
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { detail: err.message || "Login Failed" }
      );
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("register/", userData);
      return response.data;  // Return full response
    } catch (err) {
      // Return complete error response
      return rejectWithValue(err.response?.data); 
    }
  }
);

export const resendVerificationEmail = createAsyncThunk(
  "auth/resendVerification",
  async (email, { rejectWithValue }) => {
    try {
      await api.post("resend-verification/", { email });
      return { email };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    tokens: JSON.parse(localStorage.getItem("auth")),
    isAuthenticated: !!JSON.parse(localStorage.getItem("auth"))?.access,
    loading: false,
    status: "idle",
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("auth");
      state.user = null;
      state.loading = false;
      state.tokens = null;
      state.isAuthenticated = false;
    },
    updateUser: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },
    updateProfileCompleteness: (state, action) => {
      if (state.user) {
        state.user.profile_complete = action.payload;

        // Update localStorage
        const authData = JSON.parse(localStorage.getItem("auth"));
        if (authData) {
          authData.user.profile_complete = action.payload;
          localStorage.setItem("auth", JSON.stringify(authData));
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.error = null;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload || { detail: "Registration failed" };
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.tokens = {
          access: action.payload.access,
          refresh: action.payload.refresh,
        };
        state.user = action.payload.user;
        state.isAuthenticated = true;

        // Store in localStorage
        localStorage.setItem(
          "auth",
          JSON.stringify({
            access: action.payload.access,
            refresh: action.payload.refresh,
            user: action.payload.user,
          })
        );
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(resendVerificationEmail.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      });
  },
});

export const { logout } = authSlice.actions;
export const { updateUser } = authSlice.actions;
export const updateProfileCompleteness = createAction(
  "auth/updateProfileCompleteness"
);
export default authSlice.reducer;
