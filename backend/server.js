const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./src/config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/bundles', require('./src/routes/bundleRoutes'));
app.use('/api/transactions', require('./src/routes/transactionRoutes'));
app.use('/api/admin', require('./src/routes/adminRoutes'));
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'https://YOUR_VERCEL_APP.vercel.app'],
  credentials: true,
}));

// Test route
app.get('/api/hello', (req, res) => {
  res.json({ 
    message: 'Hello from Mobile Bundle Platform API!',
    status: 'Server is running',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'mobile-bundle-api',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Test endpoint: http://localhost:${PORT}/api/hello`);
});