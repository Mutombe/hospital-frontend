import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addPatient } from '../features/patient/patientSlice';

const PatientRegistration = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    medical_history: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addPatient(formData));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5">Patient Registration</h2>
      <input
        type="text"
        placeholder="Username"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        className="w-full p-2 mb-3 border rounded"
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="w-full p-2 mb-3 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        className="w-full p-2 mb-3 border rounded"
      />
      <input
        type="text"
        placeholder="Phone"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        className="w-full p-2 mb-3 border rounded"
      />
      <textarea
        placeholder="Address"
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        className="w-full p-2 mb-3 border rounded"
      />
      <textarea
        placeholder="Medical History"
        value={formData.medical_history}
        onChange={(e) => setFormData({ ...formData, medical_history: e.target.value })}
        className="w-full p-2 mb-3 border rounded"
      />
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
        Register
      </button>
    </form>
  );
};

export default PatientRegistration;