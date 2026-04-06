import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axiosInstance from '../api/axios';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      setStatus('error');
      setMessage('Invalid verification link.');
      return;
    }

    axiosInstance.get(`/auth/verify-email?token=${token}&email=${email}`)
      .then(() => {
        setStatus('success');
        setMessage('Email verified successfully! The owner will review your registration.');
      })
      .catch((error) => {
        setStatus('error');
        setMessage(error.response?.data?.detail || 'Verification failed. Link may be expired.');
      });
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
        {status === 'verifying' && (
          <>
            <div className="text-3xl mb-4">⏳</div>
            <h2 className="text-xl font-bold mb-2">Verifying...</h2>
            <p>Please wait while we verify your email address.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-3xl mb-4">✅</div>
            <h2 className="text-xl font-bold mb-2">Email Verified!</h2>
            <p className="mb-4">{message}</p>
            <Link to="/login" className="text-blue-600 hover:underline">Go to Login</Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-3xl mb-4">❌</div>
            <h2 className="text-xl font-bold mb-2">Verification Failed</h2>
            <p className="text-red-600 mb-4">{message}</p>
            <Link to="/register" className="text-blue-600 hover:underline">Try Again</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;