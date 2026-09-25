import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [regForm, setRegForm] = useState({
    customer_name: '',
    email: '',
    phone: '',
    company_name: '',
    company_address: '',
    password: '',
    confirm_password: '',
    notes: ''
  });

  // Email OTP verification state
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [otpMessage, setOtpMessage] = useState({ type: '', text: '' });

  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await login(email, password);
    if (!result.success) {
      setError(result.error);
    }
  };

  const resetOtpState = () => {
    setOtpSent(false);
    setOtpCode('');
    setEmailVerified(false);
    setOtpMessage({ type: '', text: '' });
  };

  const handleRegEmailChange = (value) => {
    setRegForm({ ...regForm, email: value });
    // If the email changes after a code was sent or verified, that
    // verification no longer applies to the new address.
    if (otpSent || emailVerified) {
      resetOtpState();
    }
  };

  const handleSendCode = async () => {
    setOtpMessage({ type: '', text: '' });

    if (!regForm.customer_name || !regForm.email) {
      setOtpMessage({ type: 'error', text: 'Please enter your name and email first.' });
      return;
    }

    setSendingCode(true);
    try {
      const response = await fetch(`${API_URL}/auth/send-verification-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: regForm.customer_name,
          email: regForm.email
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setOtpSent(true);
        setOtpCode('');
        setOtpMessage({ type: 'success', text: 'Code sent! Please check your email.' });
      } else {
        setOtpMessage({ type: 'error', text: data.detail || 'Failed to send code.' });
      }
    } catch (err) {
      setOtpMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    setOtpMessage({ type: '', text: '' });

    if (!otpCode || otpCode.length !== 6) {
      setOtpMessage({ type: 'error', text: 'Please enter the 6-digit code.' });
      return;
    }

    setVerifyingCode(true);
    try {
      const response = await fetch(`${API_URL}/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: regForm.email,
          code: otpCode
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmailVerified(true);
        setOtpMessage({ type: 'success', text: 'Email verified!' });
      } else {
        setOtpMessage({ type: 'error', text: data.detail || 'Incorrect code.' });
      }
    } catch (err) {
      setOtpMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setVerifyingCode(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!emailVerified) {
      setError('Please verify your email address before submitting.');
      return;
    }

    if (regForm.password !== regForm.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    if (!regForm.customer_name || !regForm.email || !regForm.phone || !regForm.password) {
      setError('Please fill in all required fields');
      return;
    }

    const requestData = {
      customer_name: regForm.customer_name,
      email: regForm.email,
      phone: regForm.phone,
      company_name: regForm.company_name || null,
      company_address: regForm.company_address || null,
      password: regForm.password,
      notes: regForm.notes || null
    };

    try {
      const response = await fetch(`${API_URL}/auth/register-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Registration submitted successfully! The owner will review your request.');
        setRegForm({
          customer_name: '',
          email: '',
          phone: '',
          company_name: '',
          company_address: '',
          password: '',
          confirm_password: '',
          notes: ''
        });
        resetOtpState();
        setTimeout(() => setIsLogin(true), 3000);
      } else {
        setError(data.detail || 'Registration failed');
      }
    } catch (err) {
      console.error('Network error details:', err);
      setError(`Network error: ${err.message}. Please check if backend is running.`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900 p-4">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-sm sm:max-w-md border-t-4 border-orange-500 max-h-[95vh] overflow-y-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-orange-600">PEAKNIZERLOGISTICS</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-sm">
            {success}
          </div>
        )}

        {isLogin ? (
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-2.5 px-4 rounded-md hover:bg-orange-700 transition duration-200 font-medium"
            >
              Sign In
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4 max-h-[500px] overflow-y-auto px-1">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Customer Name *
              </label>
              <input
                type="text"
                value={regForm.customer_name}
                onChange={(e) => setRegForm({...regForm, customer_name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email *
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={regForm.email}
                  onChange={(e) => handleRegEmailChange(e.target.value)}
                  disabled={emailVerified}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                  required
                />
                {!emailVerified && (
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={sendingCode}
                    className="shrink-0 bg-gray-700 hover:bg-gray-800 text-white text-sm font-medium px-3 py-2 rounded-md disabled:opacity-60 whitespace-nowrap"
                  >
                    {sendingCode ? 'Sending...' : otpSent ? 'Resend' : 'Send Code'}
                  </button>
                )}
              </div>

              {emailVerified && (
                <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                  <span>✓</span> Email verified
                </p>
              )}

              {otpSent && !emailVerified && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="6-digit code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyCode}
                    disabled={verifyingCode}
                    className="shrink-0 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium px-3 py-2 rounded-md disabled:opacity-60"
                  >
                    {verifyingCode ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
              )}

              {otpMessage.text && (
                <p className={`text-sm mt-2 ${otpMessage.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                  {otpMessage.text}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Phone *
              </label>
              <input
                type="tel"
                value={regForm.phone}
                onChange={(e) => setRegForm({...regForm, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={regForm.company_name}
                onChange={(e) => setRegForm({...regForm, company_name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Company Address
              </label>
              <textarea
                value={regForm.company_address}
                onChange={(e) => setRegForm({...regForm, company_address: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows="2"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password *
              </label>
              <input
                type="password"
                value={regForm.password}
                onChange={(e) => setRegForm({...regForm, password: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                value={regForm.confirm_password}
                onChange={(e) => setRegForm({...regForm, confirm_password: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Notes
              </label>
              <textarea
                value={regForm.notes}
                onChange={(e) => setRegForm({...regForm, notes: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows="2"
                placeholder="Any additional information..."
              />
            </div>

            {!emailVerified && (
              <p className="text-xs text-gray-500 text-center">
                Please verify your email above before submitting.
              </p>
            )}

            <button
              type="submit"
              disabled={!emailVerified}
              className="w-full bg-orange-600 text-white py-2.5 px-4 rounded-md hover:bg-orange-700 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Account
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setSuccess('');
            }}
            className="text-orange-600 hover:text-orange-800 text-sm font-medium"
          >
            {isLogin ? 'Need an account? Create one' : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;