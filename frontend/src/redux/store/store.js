import { configureStore } from '@reduxjs/toolkit';
import patientReducer from '../slices/patientSlice';
import doctorReducer from '../slices/doctorSlice';
import authReducer from '../slices/authSlice';
import medicalRecordsReducer from '../slices/medicalrecordsSlice';
import vitalSignsReducer from '../slices/vitalsignsSlice';
import diagnosisReducer from '../slices/diagnosisSlice';
import medicationReducer from '../slices/medicationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    patient: patientReducer,
    doctor: doctorReducer,
    medicalRecords: medicalRecordsReducer,
    vitalSigns: vitalSignsReducer,
    diagnosis: diagnosisReducer,
    medication: medicationReducer,
    auth: authReducer,
  },
});