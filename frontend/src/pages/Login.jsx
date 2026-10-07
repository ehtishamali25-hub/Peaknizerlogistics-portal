import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { POLICY_SECTIONS } from '../data/policyContent';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.xls', '.xlsx', '.txt'];
const MAX_FILES = 10;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// FastAPI returns detail as a string for our errors and as an array for
// validation (422) errors; always turn it into displayable text.
const extractError = (data, fallback) => {
  if (!data || !data.detail) return fallback;
  if (typeof data.detail === 'string') return data.detail;
  if (Array.isArray(data.detail)) return data.detail.map((d) => d.msg).join('; ');
  return fallback;
};

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

  // Company documents (optional)
  const [documents, setDocuments] = useState([]);
  const [docError, setDocError] = useState('');
  const fileInputRef = useRef(null);

  // Terms of Service acceptance
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Email OTP verification state
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [otpMessage, setOtpMessage] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

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
        setOtpMessage({ type: 'error', text: extractError(data, 'Failed to send code.') });
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
        setOtpMessage({ type: 'error', text: extractError(data, 'Incorrect code.') });
      }
    } catch (err) {
      setOtpMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setVerifyingCode(false);
    }
  };

  const handleFilesSelected = (e) => {
    const selected = Array.from(e.target.files || []);
    e.target.value = ''; // lets the same file be picked again later
    if (selected.length === 0) return;

    const problems = [];
    const accepted = [];

    for (const file of selected) {
      const ext = '.' + file.name.split('.').pop().toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        problems.push(`${file.name}: file type not allowed.`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        problems.push(`${file.name}: larger than 10 MB.`);
        continue;
      }
      if (documents.some((d) => d.name === file.name && d.size === file.size)) {
        continue; // already added
      }
      accepted.push(file);
    }

    const combined = [...documents, ...accepted];
    if (combined.length > MAX_FILES) {
      problems.push(`You can upload at most ${MAX_FILES} files.`);
    }

    setDocuments(combined.slice(0, MAX_FILES));
    setDocError(problems.join(' '));
  };

  const removeDocument = (index) => {
    setDocuments(documents.filter((_, i) => i !== index));
    setDocError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!emailVerified) {
      setError('Please verify your email address before submitting.');
      return;
    }

    if (!acceptedTerms) {
      setError('Please read and accept the Terms of Service & Policies before submitting.');
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

    const formData = new FormData();
    formData.append('customer_name', regForm.customer_name);
    formData.append('email', regForm.email);
    formData.append('phone', regForm.phone);
    formData.append('password', regForm.password);
    formData.append('accepted_terms', 'true');
    if (regForm.company_name) formData.append('company_name', regForm.company_name);
    if (regForm.company_address) formData.append('company_address', regForm.company_address);
    if (regForm.notes) formData.append('notes', regForm.notes);
    documents.forEach((file) => formData.append('files', file));

    setSubmitting(true);
    try {
      // No Content-Type header: the browser sets the multipart boundary itself
      const response = await fetch(`${API_URL}/auth/register-request`, {
        method: 'POST',
        body: formData,
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
        setDocuments([]);
        setDocError('');
        setAcceptedTerms(false);
        resetOtpState();
        setTimeout(() => setIsLogin(true), 3000);
      } else {
        setError(extractError(data, 'Registration failed'));
      }
    } catch (err) {
      console.error('Network error details:', err);
      setError(`Network error: ${err.message}. Please check if backend is running.`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900 p-4">
      <div className={`bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full border-t-4 border-orange-500 max-h-[95vh] overflow-y-auto ${isLogin ? 'max-w-sm sm:max-w-md' : 'max-w-sm sm:max-w-2xl'}`}>
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
          <form onSubmit={handleRegister} className="space-y-4">
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
                Company Documents
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Optional. PDF, images, Word or Excel files. Up to {MAX_FILES} files, 10 MB each.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={ALLOWED_EXTENSIONS.join(',')}
                onChange={handleFilesSelected}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 hover:border-orange-500 text-gray-600 hover:text-orange-600 rounded-md py-3 text-sm font-medium transition-colors"
              >
                + Add documents
              </button>

              {docError && (
                <p className="text-xs text-red-600 mt-2">{docError}</p>
              )}

              {documents.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {documents.map((file, index) => (
                    <li
                      key={`${file.name}-${file.size}-${index}`}
                      className="flex items-center justify-between gap-2 border border-gray-200 rounded-md px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="text-sm text-gray-800 break-all">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDocument(index)}
                        className="shrink-0 text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
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

            {/* Terms of Service */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Terms of Service & Policies
              </label>
              <div className="h-64 sm:h-80 overflow-y-auto border border-gray-300 rounded-md p-4 bg-gray-50 space-y-4">
                  {POLICY_SECTIONS.map((s) => (
                    <div key={s.num} className={s.highlight ? 'text-red-700' : 'text-gray-700'}>
                      <p className="text-sm font-bold">{s.num}. {s.title}</p>
                      {s.body && <p className="text-sm leading-relaxed mt-1">{s.body}</p>}
                      {s.list && (
                        <ul className="list-disc list-inside text-sm leading-relaxed mt-1 space-y-1">
                          {s.list.map((item) => <li key={item}>{item}</li>)}
                        </ul>
                      )}
                      {s.contact && (
                        <ul className="text-sm leading-relaxed mt-1 space-y-1">
                          {s.contact.map((c) => <li key={c.value}>{c.value}</li>)}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>

              <label className="flex items-start gap-2 mt-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">
                  I have read and agree to the Terms of Service & Policies *
                </span>
              </label>
            </div>

            {(!emailVerified || !acceptedTerms) && (
              <p className="text-xs text-gray-500 text-center">
                {!emailVerified && !acceptedTerms
                  ? 'Please verify your email and accept the terms before submitting.'
                  : !emailVerified
                    ? 'Please verify your email above before submitting.'
                    : 'Please accept the Terms of Service & Policies before submitting.'}
              </p>
            )}

            <button
              type="submit"
              disabled={!emailVerified || !acceptedTerms || submitting}
              className="w-full bg-orange-600 text-white py-2.5 px-4 rounded-md hover:bg-orange-700 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Create Account'}
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