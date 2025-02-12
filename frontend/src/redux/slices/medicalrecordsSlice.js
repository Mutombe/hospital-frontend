// features/medicalHistory/medicalRecordsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../../utils/api';

// Async thunks for medical records
export const fetchMedicalRecords = createAsyncThunk(
  'medicalRecords/fetchMedicalRecords',
  async (patientId) => {
    const response = await api.get(`/medical-records/?patient=${patientId}`);
    return response.data;
  }
);

export const createMedicalRecord = createAsyncThunk(
  'medicalRecords/createMedicalRecord',
  async (recordData) => {
    const response = await api.post('/medical-records/', recordData);
    return response.data;
  }
);

export const updateMedicalRecord = createAsyncThunk(
  'medicalRecords/updateMedicalRecord',
  async ({ id, recordData }) => {
    const response = await api.put(`/medical-records/${id}/`, recordData);
    return response.data;
  }
);

const medicalRecordsSlice = createSlice({
  name: 'medicalRecords',
  initialState: {
    records: [],
    currentRecord: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    setCurrentRecord: (state, action) => {
      state.currentRecord = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedicalRecords.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMedicalRecords.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.records = action.payload;
      })
      .addCase(fetchMedicalRecords.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setCurrentRecord } = medicalRecordsSlice.actions;
export default medicalRecordsSlice.reducer;