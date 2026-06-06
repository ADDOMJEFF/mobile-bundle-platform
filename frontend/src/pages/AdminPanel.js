import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const ADMIN_PHONE = '+233500000000';

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchBundles();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/stats?phoneNumber=${ADMIN_PHONE}`);
      setStats(res.data.stats);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/users?phoneNumber=${ADMIN_PHONE}`);
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/transactions?phoneNumber=${ADMIN_PHONE}`);
      setTransactions(res.data.transactions);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBundles = async () => {
    try {
      const res = await axios.get(`${API_URL}/bundles`);
      setBundles(res.data.bundles);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBundle = async (id) => {
    if (window.confirm('Delete this bundle?')) {
      await axios.delete(`${API_URL}/admin/bundles/${id}?phoneNumber=${ADMIN_PHONE}`);
      fetchBundles();
      fetchStats();
    }
  };

  const toggleBundleStatus = async (bundle) => {
    await axios.put(`${API_URL}/admin/bundles/${bundle._id}?phoneNumber=${ADMIN_PHONE}`, {
      isActive: !bundle.isActive,
    });
    fetchBundles();
    fetchStats();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold">🛡️ Admin Panel</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 flex gap-6">
          {['stats', 'bundles', 'users', 'transactions'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                if (tab === 'users') fetchUsers();
                if (tab === 'transactions') fetchTransactions();
              }}
              className={`py-3 px-2 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Tab */}
        {activeTab === 'stats' && stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Users', value: stats.totalUsers, color: 'blue' },
              { label: 'Retailers', value: stats.totalRetailers, color: 'green' },
              { label: 'Bundles', value: stats.totalBundles, color: 'purple' },
              { label: 'Transactions', value: stats.totalTransactions, color: 'orange' },
              { label: 'Revenue', value: `GH₵ ${stats.totalRevenue}`, color: 'teal' },
              { label: 'Commissions', value: `GH₵ ${stats.totalCommissions}`, color: 'pink' },
            ].map((stat) => (
              <div key={stat.label} className={`bg-${stat.color}-50 rounded-lg p-4 border border-${stat.color}-200`}>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className={`text-2xl font-bold text-${stat.color}-700`}>{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Bundles Tab */}
        {activeTab === 'bundles' && (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left text-sm">Name</th>
                  <th className="p-3 text-left text-sm">Network</th>
                  <th className="p-3 text-left text-sm">Type</th>
                  <th className="p-3 text-left text-sm">Price</th>
                  <th className="p-3 text-left text-sm">Status</th>
                  <th className="p-3 text-left text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bundles.map((bundle) => (
                  <tr key={bundle._id} className="border-t">
                    <td className="p-3 text-sm">{bundle.name}</td>
                    <td className="p-3 text-sm">{bundle.network}</td>
                    <td className="p-3 text-sm capitalize">{bundle.type}</td>
                    <td className="p-3 text-sm">GH₵ {bundle.amount}</td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        bundle.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {bundle.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-3 text-sm space-x-2">
                      <button
                        onClick={() => toggleBundleStatus(bundle)}
                        className="text-blue-600 hover:underline"
                      >
                        {bundle.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteBundle(bundle._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left text-sm">Name</th>
                  <th className="p-3 text-left text-sm">Phone</th>
                  <th className="p-3 text-left text-sm">Role</th>
                  <th className="p-3 text-left text-sm">Status</th>
                  <th className="p-3 text-left text-sm">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-t">
                    <td className="p-3 text-sm">{user.name}</td>
                    <td className="p-3 text-sm">{user.phoneNumber}</td>
                    <td className="p-3 text-sm capitalize">{user.role}</td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left text-sm">User</th>
                  <th className="p-3 text-left text-sm">Bundle</th>
                  <th className="p-3 text-left text-sm">Amount</th>
                  <th className="p-3 text-left text-sm">Commission</th>
                  <th className="p-3 text-left text-sm">Retailer</th>
                  <th className="p-3 text-left text-sm">Status</th>
                  <th className="p-3 text-left text-sm">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx._id} className="border-t">
                    <td className="p-3 text-sm">{tx.user?.name || 'N/A'}</td>
                    <td className="p-3 text-sm">{tx.bundle?.name || 'N/A'}</td>
                    <td className="p-3 text-sm">GH₵ {tx.amount}</td>
                    <td className="p-3 text-sm text-green-600">GH₵ {tx.commission}</td>
                    <td className="p-3 text-sm">{tx.retailer?.name || '-'}</td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        tx.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                        tx.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {tx.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-500">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;