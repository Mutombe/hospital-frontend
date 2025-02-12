// features/medicalHistory/diagnosisSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../../utils/api';

export const createDiagnosis = createAsyncThunk(
  'diagnosis/createDiagnosis',
  async (diagnosisData) => {
    const response = await api.post('/diagnoses/', diagnosisData);
    // Automatically create medical record entry
    await axios.post('/api/medical-records/', {
      patient: diagnosisData.patientId,
      doctor: diagnosisData.doctorId,
      diagnosis: response.data.id,
      type: 'DIAGNOSIS',
      notes: diagnosisData.notes,
    });
    return response.data;
  }
);

const diagnosisSlice = createSlice({
  name: 'diagnosis',
  initialState: {
    diagnoses: [],
    currentDiagnosis: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    setCurrentDiagnosis: (state, action) => {
      state.currentDiagnosis = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createDiagnosis.fulfilled, (state, action) => {
        state.diagnoses.push(action.payload);
        state.currentDiagnosis = action.payload;
      });
  },
});

export const { setCurrentDiagnosis } = diagnosisSlice.actions;
export default diagnosisSlice.reducer;