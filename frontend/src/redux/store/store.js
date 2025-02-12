import { configureStore } from '@reduxjs/toolkit';
import patientReducer from '../features/patient/patientSlice';
//import doctorReducer from '../features/doctor/doctorSlice';
import appointmentReducer from '../features/appointment/appointmentSlice';

export const store = configureStore({
  reducer: {
    patient: patientReducer,
    doctor: doctorReducer,
    appointment: appointmentReducer,
  },
});