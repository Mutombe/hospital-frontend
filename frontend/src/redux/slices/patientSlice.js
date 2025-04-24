import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// features/patients/patientSlice.js
import axios from 'axios';

export const fetchPatients = createAsyncThunk(
  'patients/fetchPatients',
  async () => {
    const response = await api.get('/patients/');
    return response.data;
  }
);

export const createMedicalRecord = createAsyncThunk(
  'patients/createMedicalRecord',
  async (recordData) => {
    const response = await api.post('/medical-records/', recordData);
    return response.data;
  }
);

export const bookAppointment = createAsyncThunk(
  'patients/bookAppointment',
  async (appointmentData) => {
    const response = await api.post('/appointments/', appointmentData);
    return response.data;
  }
);

export const fetchAppointments = createAsyncThunk(
  'patients/fetchAppointment',
  async () => {
    const response = await api.get('/appointments/');
    return response.data;
  }
);

const patientSlice = createSlice({
  name: 'patients',
  initialState: {
    patients: [],
    medicalRecords: [],
    appointments: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    setNotification: (state, action) => {
      state.notification = action.payload;
    },
  },
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
    .addCase(createMedicalRecord.fulfilled, (state, action) => {
      state.medicalRecords.push(action.payload);
    })
    .addCase(bookAppointment.fulfilled, (state, action) => {
      state.appointments.push(action.payload);
    })
    .addCase(fetchAppointments.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(fetchAppointments.fulfilled, (state, action) => {
      state.appointments.push(action.payload);
    })
    .addCase(fetchAppointments.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    }); 
  },
});

export const { setNotification } = patientSlice.actions;
export default patientSlice.reducer;