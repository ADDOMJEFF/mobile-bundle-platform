import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function RetailerRegisterPage() {
  const { user, login } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phoneNumber: user?.phoneNumber || '',
    name: user?.name || '',
    shopName: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/register-retailer`, formData);
      
      // Update user in context
      login(response.data.user);
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/retailer-dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Registration Successful!</h2>
          <p className="text-gray-600">You are now a retailer. Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-lg mx-auto px-4">
        <button
          onClick={() => navigate('/bundles')}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Back to Bundles
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Become a Retailer</h1>
          <p className="text-gray-600 mb-6">Register your shop and earn commission on every sale!</p>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                readOnly
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shop Name
              </label>
              <input
                type="text"
                name="shopName"
                value={formData.shopName}
                onChange={handleChange}
                placeholder="Your mobile money shop name"
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Accra, Kumasi, etc."
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-blue-800 mb-2">💼 Retailer Benefits:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>✅ 5% commission on every sale</li>
                <li>✅ Your own sub-portal link</li>
                <li>✅ Real-time earnings dashboard</li>
                <li>✅ Customer management</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 text-lg font-semibold"
            >
              {loading ? 'Registering...' : 'Register as Retailer'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RetailerRegisterPage;