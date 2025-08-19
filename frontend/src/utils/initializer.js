// src/components/AuthInitializer.js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateUser } from '../redux/slices/authSlice';

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Rehydrate auth state from localStorage on app initialization
    const authData = JSON.parse(localStorage.getItem("auth"));
    if (authData && authData.user) {
      dispatch(updateUser(authData.user));
    }
  }, [dispatch]);

  return children;
};

export default AuthInitializer;