import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function SubPortalPage() {
  const { shopSlug } = useParams();
  const [retailer, setRetailer] = useState(null);
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [recipientPhone, setRecipientPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mtn_momo');
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  useEffect(() => {
    fetchShopDetails();
    fetchBundles();
  }, [shopSlug]);

  const fetchShopDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/shop/${shopSlug}`);
      setRetailer(response.data.retailer);
    } catch (err) {
      setError('Shop not found');
      console.error(err);
    }
  };

  const fetchBundles = async () => {
    try {
      const response = await axios.get(`${API_URL}/bundles`);
      setBundles(response.data.bundles);
    } catch (err) {
      console.error('Failed to fetch bundles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!recipientPhone) {
      alert('Please enter recipient phone number');
      return;
    }

    setPurchaseLoading(true);
    try {
      await axios.post(`${API_URL}/transactions/purchase`, {
        phoneNumber: recipientPhone,
        bundleId: selectedBundle._id,
        recipientPhone,
        paymentMethod,
        retailerId: retailer._id,
      });

      setPurchaseSuccess(true);
      setTimeout(() => {
        setSelectedBundle(null);
        setPurchaseSuccess(false);
        setRecipientPhone('');
      }, 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Payment failed');
    } finally {
      setPurchaseLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Shop Not Found</h2>
          <p className="text-gray-600">This retailer link may be invalid.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading shop...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shop Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold">{retailer?.retailerDetails?.shopName || 'Mobile Shop'}</h1>
          <p className="text-green-100 mt-1">{retailer?.retailerDetails?.location}</p>
          <p className="text-sm text-green-200 mt-2">Powered by Mobile Bundle Platform</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Purchase Modal */}
        {selectedBundle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              {purchaseSuccess ? (
                <div className="text-center py-6">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-xl font-bold text-green-600 mb-2">Payment Initiated!</h3>
                  <p className="text-gray-600">Check your phone to approve payment.</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Purchase Bundle</h2>
                    <button
                      onClick={() => setSelectedBundle(null)}
                      className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                      ×
                    </button>
                  </div>

                  <div className="bg-gray-50 p-3 rounded mb-4">
                    <p className="font-semibold">{selectedBundle.name}</p>
                    <p className="text-sm text-gray-600">{selectedBundle.network} • {selectedBundle.validity}</p>
                    <p className="text-lg font-bold text-green-600 mt-1">GH₵ {selectedBundle.amount}</p>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Recipient Phone</label>
                    <input
                      type="tel"
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      placeholder="+233XXXXXXXXX"
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Payment Method</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full p-3 border rounded-lg"
                    >
                      <option value="mtn_momo">MTN Mobile Money</option>
                      <option value="telecel_cash">Telecel Cash</option>
                      <option value="airteltigo_money">AirtelTigo Money</option>
                      <option value="card">Debit/Credit Card</option>
                    </select>
                  </div>

                  <button
                    onClick={handlePurchase}
                    disabled={purchaseLoading}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-semibold"
                  >
                    {purchaseLoading ? 'Processing...' : `Pay GH₵ ${selectedBundle.amount}`}
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Bundle Grid */}
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Available Bundles</h2>
        
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
                  onClick={() => setSelectedBundle(bundle)}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SubPortalPage;