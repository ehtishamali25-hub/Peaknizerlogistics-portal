import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Registration form state
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

  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await login(email, password);
    if (!result.success) {
      setError(result.error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate passwords match
    if (regForm.password !== regForm.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    // Validate required fields
    if (!regForm.customer_name || !regForm.email || !regForm.phone || !regForm.password) {
      setError('Please fill in all required fields');
      return;
    }

    // Prepare the data to send
    const requestData = {
      customer_name: regForm.customer_name,
      email: regForm.email,
      phone: regForm.phone,
      company_name: regForm.company_name || null,
      company_address: regForm.company_address || null,
      password: regForm.password,
      notes: regForm.notes || null
    };

    console.log('Sending registration data:', requestData);

    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/register-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96 border-t-4 border-orange-500">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-orange-600">PEAKNIZERLOGISTICS</h1>
          <p className="text-gray-600 mt-2">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {isLogin ? (
          // Login Form
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
              className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition duration-200 font-medium"
            >
              Sign In
            </button>
          </form>
        ) : (
          // Registration Form
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
              <input
                type="email"
                value={regForm.email}
                onChange={(e) => setRegForm({...regForm, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
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

            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition duration-200 font-medium"
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

        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Demo Credentials:</p>
          <p>Owner: ali@peaknizer.com / password123</p>
          <p>Employee: john@peaknizer.com / password123</p>
          <p>Customer: syed@peaknizer.com / password123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;