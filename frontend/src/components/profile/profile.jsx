// CompleteProfile.js
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const CompleteProfile = () => {
  const [formData, setFormData] = useState({});
  const { role } = useSelector((state) => state.auth.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = role === 'PATIENT' ? '/patients/' : '/doctors/';
    await api.post(endpoint, formData);
    // Redirect to dashboard
  };

  return (
    <form onSubmit={handleSubmit}>
      {role === 'PATIENT' ? (
        <>
          <input name="phone" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          <input name="address" onChange={(e) => setFormData({...formData, address: e.target.value})} />
        </>
      ) : (
        <>
          <input name="license" onChange={(e) => setFormData({...formData, license_number: e.target.value})} />
          <input name="specialty" onChange={(e) => setFormData({...formData, specialty: e.target.value})} />
        </>
      )}
      <button type="submit">Submit</button>
    </form>
  );
};