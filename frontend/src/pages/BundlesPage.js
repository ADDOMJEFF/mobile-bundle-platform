import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function BundlesPage() {
  const [bundles, setBundles] = useState([]);
  const [network, setNetwork] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(true);
  const { user, logout } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBundles();
  }, [network, type]);

  const fetchBundles = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/bundles?`;
      if (network) url += `network=${network}&`;
      if (type) url += `type=${type}&`;

      const response = await axios.get(url);
      setBundles(response.data.bundles);
    } catch (err) {
      console.error('Failed to fetch bundles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = (bundle) => {
    navigate(`/checkout/${bundle._id}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center flex-wrap gap-3">
          <h1 className="text-xl font-bold text-gray-800">📱 Mobile Bundles</h1>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => navigate('/history')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              📋 History
            </button>
            <button
              onClick={() => {
                if (user?.role === 'retailer') {
                  navigate('/retailer-dashboard');
                } else {
                  navigate('/register-retailer');
                }
              }}
              className="text-sm text-green-600 hover:text-green-800"
            >
              🏪 {user?.role === 'retailer' ? 'Dashboard' : 'Become Retailer'}
            </button>
            <span className="text-sm text-gray-600">
              👤 {user?.name || user?.phoneNumber}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 flex gap-4 flex-wrap">
          <select
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="">All Networks</option>
            <option value="MTN">MTN</option>
            <option value="Vodafone">Vodafone</option>
            <option value="AirtelTigo">AirtelTigo</option>
          </select>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="">All Types</option>
            <option value="data">Data</option>
            <option value="voice">Voice</option>
            <option value="combo">Combo</option>
          </select>
        </div>

        {/* Bundle Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading bundles...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bundles.map((bundle) => (
              <div key={bundle._id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    bundle.network === 'MTN' ? 'bg-yellow-100 text-yellow-800' :
                    bundle.network === 'Vodafone' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {bundle.network}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    bundle.type === 'data' ? 'bg-green-100 text-green-800' :
                    bundle.type === 'voice' ? 'bg-purple-100 text-purple-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {bundle.type}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mb-1">{bundle.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{bundle.description}</p>

                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  {bundle.dataVolume && <span>📶 {bundle.dataVolume}</span>}
                  <span>⏱️ {bundle.validity}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-800">GH₵ {bundle.amount}</span>
                  <button
                    onClick={() => handleBuy(bundle)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && bundles.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No bundles found. Try different filters.
          </div>
        )}
      </div>
    </div>
  );
}

export default BundlesPage;