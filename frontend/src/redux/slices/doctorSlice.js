// features/doctors/doctorSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchDoctors = createAsyncThunk(
  'doctors/fetchDoctors',
  async () => {
    const response = await api.get('/doctors/');
    return response.data;
  }
);

export const updateSchedule = createAsyncThunk(
  'doctors/updateSchedule',
  async ({ doctorId, scheduleData }) => {
    const response = await api.put(`/doctors/${doctorId}/schedule/`, scheduleData);
    return response.data;
  }
);

export const handleAppointment = createAsyncThunk(
  'doctors/handleAppointment',
  async ({ appointmentId, status }) => {
    const response = await api.patch(`/appointments/${appointmentId}/`, { status });
    return response.data;
  }
);

const doctorSlice = createSlice({
  name: 'doctors',
  initialState: {
    doctors: [],
    schedules: [],
    appointments: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    setAvailability: (state, action) => {
      const { doctorId, availability } = action.payload;
      const doctor = state.doctors.find(d => d.id === doctorId);
      if (doctor) {
        doctor.availability = availability;
      }
    },
    setNotification: (state, action) => {
      state.notification = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.doctors = action.payload;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setAvailability, setNotification } = doctorSlice.actions;
export default doctorSlice.reducer;