import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function RetailerDashboard() {
  const { user } = useApp();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalEarnings: 0,
    totalTransactions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    if (user.role !== 'retailer') {
      navigate('/bundles');
      return;
    }
    fetchRetailerData();
  }, []);

  const fetchRetailerData = async () => {
    try {
      const response = await axios.get(`${API_URL}/transactions/retailer?retailerId=${user.id}`);
      const txns = response.data.transactions || [];

      setTransactions(txns);

      // Calculate stats
      const totalSales = txns.reduce((sum, tx) => sum + tx.amount, 0);
      const totalEarnings = txns.reduce((sum, tx) => sum + (tx.commission || 0), 0);

      setStats({
        totalSales,
        totalEarnings,
        totalTransactions: txns.length,
      });
    } catch (err) {
      console.error('Failed to fetch retailer data:', err);
    } finally {
      setLoading(false);
    }
  };

  const copySubPortalLink = () => {
    navigator.clipboard.writeText(user.retailerDetails?.subPortalUrl || '');
    alert('Sub-portal link copied!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">🏪 Retailer Dashboard</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/bundles')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              📱 Buy Bundles
            </button>
            <span className="text-sm text-gray-600">
              👤 {user?.name}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Shop Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{user?.retailerDetails?.shopName}</h2>
              <p className="text-gray-600">{user?.retailerDetails?.location}</p>
              <p className="text-sm text-gray-500 mt-1">Commission Rate: {user?.retailerDetails?.commissionRate}%</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Sub-Portal</p>
              <button
                onClick={copySubPortalLink}
                className="text-blue-600 text-sm hover:text-blue-800 underline"
              >
                📋 Copy Link
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500 mb-1">Total Sales</p>
            <p className="text-3xl font-bold text-gray-800">GH₵ {stats.totalSales.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500 mb-1">Total Earnings</p>
            <p className="text-3xl font-bold text-green-600">GH₵ {stats.totalEarnings.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500 mb-1">Transactions</p>
            <p className="text-3xl font-bold text-blue-600">{stats.totalTransactions}</p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Sales</h3>

          {loading ? (
            <p className="text-gray-500">Loading transactions...</p>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-2">No sales yet</p>
              <p className="text-sm text-gray-400">Share your sub-portal link to start earning!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b">
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Bundle</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Commission</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 10).map((tx) => (
                    <tr key={tx._id} className="border-b last:border-0">
                      <td className="py-3 text-sm">{tx.recipientPhone}</td>
                      <td className="py-3 text-sm">{tx.bundle?.name || 'N/A'}</td>
                      <td className="py-3 text-sm font-semibold">GH₵ {tx.amount}</td>
                      <td className="py-3 text-sm text-green-600">GH₵ {tx.commission}</td>
                      <td className="py-3 text-sm text-gray-500">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          tx.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                          tx.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {tx.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RetailerDashboard;