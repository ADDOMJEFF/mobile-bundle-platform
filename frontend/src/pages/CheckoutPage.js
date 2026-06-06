import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function CheckoutPage() {
  const { bundleId } = useParams();
  const { user } = useApp();
  const navigate = useNavigate();

  const [bundle, setBundle] = useState(null);
  const [recipientPhone, setRecipientPhone] = useState(user?.phoneNumber || '');
  const [paymentMethod, setPaymentMethod] = useState('mtn_momo');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchBundle();
  }, [bundleId]);

  const fetchBundle = async () => {
    try {
      const response = await axios.get(`${API_URL}/bundles/${bundleId}`);
      setBundle(response.data.bundle);
    } catch (err) {
      setError('Failed to load bundle');
      console.error(err);
    }
  };

  const handlePurchase = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/transactions/purchase`, {
        phoneNumber: user.phoneNumber,
        bundleId: bundle._id,
        recipientPhone,
        paymentMethod,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/bundles');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (error && !bundle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p className="text-xl mb-4">❌ {error}</p>
          <button onClick={() => navigate('/bundles')} className="text-blue-600 hover:underline">
            Go back to bundles
          </button>
        </div>
      </div>
    );
  }

  if (!bundle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading bundle details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-lg mx-auto px-4">
        {/* Back button */}
        <button
          onClick={() => navigate('/bundles')}
          className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-1"
        >
          ← Back to bundles
        </button>

        {success ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Initiated!</h2>
            <p className="text-gray-600">Check your phone to approve the payment.</p>
            <p className="text-sm text-gray-500 mt-2">Redirecting to bundles...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
                {error}
              </div>
            )}

            {/* Bundle Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-sm font-semibold text-blue-600">{bundle.network}</span>
                  <h3 className="text-lg font-semibold">{bundle.name}</h3>
                  <p className="text-sm text-gray-600">{bundle.description}</p>
                </div>
              </div>
              <div className="flex gap-4 text-sm text-gray-500">
                {bundle.dataVolume && <span>📶 {bundle.dataVolume}</span>}
                <span>⏱️ {bundle.validity}</span>
              </div>
              <div className="mt-3 text-2xl font-bold text-gray-800">
                GH₵ {bundle.amount}
              </div>
            </div>

            <form onSubmit={handlePurchase}>
              {/* Recipient Phone */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Phone Number
                </label>
                <input
                  type="tel"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  placeholder="+233XXXXXXXXX"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <div className="space-y-2">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="mtn_momo"
                      checked={paymentMethod === 'mtn_momo'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <span className="text-yellow-700 font-semibold">💛 MTN Mobile Money</span>
                  </label>

                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="telecel_cash"
                      checked={paymentMethod === 'telecel_cash'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <span className="text-red-700 font-semibold">❤️ Telecel Cash</span>
                  </label>

                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="airteltigo_money"
                      checked={paymentMethod === 'airteltigo_money'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <span className="text-blue-700 font-semibold">💙 AirtelTigo Money</span>
                  </label>

                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <span className="text-gray-700 font-semibold">💳 Debit/Credit Card</span>
                  </label>
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>GH₵ {bundle.amount}</span>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 text-lg font-semibold"
              >
                {loading ? '⏳ Processing...' : `Pay GH₵ ${bundle.amount}`}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckoutPage;