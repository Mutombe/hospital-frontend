// features/medicalHistory/vitalSignsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../../utils/api';

export const recordVitalSigns = createAsyncThunk(
  'vitalSigns/recordVitalSigns',
  async (vitalData) => {
    const response = await api.post('/vitals/', vitalData);
    return response.data;
  }
);

export const fetchVitalHistory = createAsyncThunk(
  'vitalSigns/fetchVitalHistory',
  async (patientId) => {
    const response = await api.get(`/vitals/?patient=${patientId}`);
    return response.data;
  }
);

const vitalSignsSlice = createSlice({
  name: 'vitalSigns',
  initialState: {
    currentVitals: null,
    vitalHistory: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    updateCurrentVitals: (state, action) => {
      state.currentVitals = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(recordVitalSigns.fulfilled, (state, action) => {
        state.vitalHistory.push(action.payload);
        state.currentVitals = action.payload;
      });
  },
});

export const { updateCurrentVitals } = vitalSignsSlice.actions;
export default vitalSignsSlice.reducer;