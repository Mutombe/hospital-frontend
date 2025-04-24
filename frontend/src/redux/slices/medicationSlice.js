// features/medicalHistory/medicationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const prescribeMedication = createAsyncThunk(
  'medication/prescribeMedication',
  async (medicationData) => {
    const response = await api.post('/medications/', medicationData);
    // Automatically create medical record entry
    await api.post('/medical-records/', {
      patient: medicationData.patientId,
      doctor: medicationData.doctorId,
      medication: response.data.id,
      type: 'PRESCRIPTION',
      notes: medicationData.instructions,
    });
    return response.data;
  }
);

export const fetchMedications = createAsyncThunk(
  'medication/fetchMedications',
  async () => {
    const response = await api.get('/medications/');
    return response.data;
  }
);

const medicationSlice = createSlice({
  name: 'medication',
  initialState: {
    medications: [],
    activePrescriptions: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    updatePrescriptionStatus: (state, action) => {
      const { id, status } = action.payload;
      const prescription = state.activePrescriptions.find(p => p.id === id);
      if (prescription) {
        prescription.status = status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(prescribeMedication.fulfilled, (state, action) => {
        state.medications.push(action.payload);
        state.activePrescriptions.push(action.payload);
      })
      .addCase(fetchMedications.fulfilled, (state, action) => {
        state.medications = action.payload;
      });
  },
});

export const { updatePrescriptionStatus } = medicationSlice.actions;
export default medicationSlice.reducer;