import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/patients/';

export const fetchPatients = createAsyncThunk('patients/fetchPatients', async () => {
  const response = await axios.get(API_URL);
  return response.data;
});

export const addPatient = createAsyncThunk('patients/addPatient', async (patient) => {
  const response = await axios.post(API_URL, patient);
  return response.data;
});

const patientSlice = createSlice({
  name: 'patient',
  initialState: {
    patients: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.patients = action.payload;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addPatient.fulfilled, (state, action) => {
        state.patients.push(action.payload);
      });
  },
});

export default patientSlice.reducer;