// VerifyEmailPage.js
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import api from '../../utils/api';
import { login } from '../../redux/slices/authSlice';
import { notifications } from '@mantine/notifications';
import { useParams, useNavigate } from 'react-router-dom';
import { Mail, RefreshCw, CheckCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

// Component shown immediately after registration
export const CheckEmailPage = () => {
  const handleResendEmail = () => {
    // Implementation for resending verification email
  };

  return (
    <div className=" bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Check Your Email
          </h2>
          
          <p className="text-gray-600 mb-6">
            We've sent a verification link to your email address. Please click the link to activate your account.
          </p>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Didn't receive the email? Check your spam folder or click below to resend.
            </p>
            
            <button
              onClick={handleResendEmail}
              className="flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Resend Verification Email</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const VerifyEmailPage = () => {
  const { uidb64, token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const toastId = toast.loading('Verifying email...');
    
    const verifyEmail = async () => {
      try {
        const response = await api.get(`/verify-email/${uidb64}/${token}/`);
        
        localStorage.setItem('tokens', JSON.stringify(response.data));
        dispatch(login(response.data));
        
        toast.success('Email Verified', {
          id: toastId,
          description: 'Your account is now active',
          action: {
            label: 'Continue',
            onClick: () => navigate('/complete-profile')
          }
        });

      } catch (error) {
        toast.error('Verification Failed', {
          id: toastId,
          description: error.response?.data?.error || 'Invalid verification link'
        });
        navigate('/login');
      }
    };

    verifyEmail();
  }, [uidb64, token, navigate, dispatch]);

  return (
    <div className="flex justify-center items-center">
      <div className="text-center animate-pulse">
        <div className="text-2xl font-bold mb-4">🔒 Verifying Account...</div>
        <p className="text-gray-600">Securely activating your credentials</p>
      </div>
    </div>
  );
};

export default VerifyEmailPage;


export const VerifyEmailHandler = () => {
  const { uidb64, token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [verificationStatus, setVerificationStatus] = useState('verifying');

  useEffect(() => {
    const verifyEmailAndLogin = async () => {
      try {
        // Step 1: Verify the email
        const verificationResponse = await fetch(`http://localhost:8000/api/verify-email/${uidb64}/${token}/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!verificationResponse.ok) {
          throw new Error('Email verification failed');
        }

        // Get the tokens from the verification response
        const data = await verificationResponse.json(); 

        // Step 2: Store the tokens and update auth state
        localStorage.setItem('tokens', JSON.stringify(data));
        await dispatch(login(data)).unwrap();

        // Step 3: Update status and show notifications
        setVerificationStatus('success');
        
        // Step 4: Redirect to profile completion
        setTimeout(() => {
          navigate('/complete-profile');
        }, 2000);

      } catch (error) {
        setVerificationStatus('error');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    };

    verifyEmailAndLogin();
  }, [uidb64, token, navigate, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              verificationStatus === 'verifying' ? 'bg-blue-100' :
              verificationStatus === 'success' ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <CheckCircle className={`w-8 h-8 ${
                verificationStatus === 'verifying' ? 'text-blue-500' :
                verificationStatus === 'success' ? 'text-green-500' : 'text-red-500'
              }`} />
            </div>
          </div>

          {verificationStatus === 'verifying' && (
            <>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Verifying Your Email
              </h2>
              <p className="text-gray-600">
                Please wait while we activate your account...
              </p>
            </>
          )}

          {verificationStatus === 'success' && (
            <>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Email Verified Successfully!
              </h2>
              <p className="text-gray-600">
                Your account has been activated. Redirecting you to complete your profile...
              </p>
            </>
          )}

          {verificationStatus === 'error' && (
            <>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Verification Failed
              </h2>
              <p className="text-gray-600">
                Unable to verify your email. Redirecting you to login...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
