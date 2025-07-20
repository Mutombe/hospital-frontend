// src/components/RequireAuth.js
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { openAuthModal } from '../redux/slices/authModal';

const RequireAuth = ({ children, requireCompleteProfile }) => {
  const auth = useSelector(state => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!auth.isAuthenticated) {
      dispatch(openAuthModal({
        mode: 'login',
        redirectPath: location.pathname
      }));
    }
  }, [auth.isAuthenticated, dispatch, location]);

  // Show nothing while auth modal is open
  if (!auth.isAuthenticated) {
    return null;
  }

  // Handle profile completion requirement
  if (requireCompleteProfile && !auth.user?.profile_complete) {
    return children; // Already in profile page context
  }

  return children;
};

export default RequireAuth;