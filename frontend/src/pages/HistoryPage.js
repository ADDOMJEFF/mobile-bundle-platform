import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function HistoryPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${API_URL}/transactions?phoneNumber=${user.phoneNumber}`);
      setTransactions(response.data.transactions);
    } catch (err) {
      console.error('Failed to load transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'completed': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'failed': 'bg-red-100 text-red-800',
      'delivered': 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">📋 Transaction History</h1>
          <button
            onClick={() => navigate('/bundles')}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Bundles
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No transactions yet</p>
            <button
              onClick={() => navigate('/bundles')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Buy Your First Bundle
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div key={tx._id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {tx.bundle?.name || 'Bundle'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      To: {tx.recipientPhone}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(tx.paymentStatus)}`}>
                    {tx.paymentStatus}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <div className="flex gap-4 text-gray-500">
                    <span>💳 {tx.paymentMethod === 'mtn_momo' ? 'MTN MoMo' :
                           tx.paymentMethod === 'telecel_cash' ? 'Telecel Cash' :
                           tx.paymentMethod === 'airteltigo_money' ? 'AirtelTigo Money' : 'Card'}</span>
                    <span>📅 {new Date(tx.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span className="text-lg font-bold text-gray-800">GH₵ {tx.amount}</span>
                </div>

                {tx.commission > 0 && (
                  <div className="mt-2 text-xs text-green-600">
                    Commission earned: GH₵ {tx.commission}
                  </div>
                )}

                {tx.retailer && (
                  <div className="mt-2 text-xs text-blue-600">
                    Via retailer: {tx.retailer.name || tx.retailer.phoneNumber}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryPage;