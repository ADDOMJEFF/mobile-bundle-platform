const admin = require('firebase-admin');

// Try to load service account, use mock if not available
let serviceAccount;
try {
  serviceAccount = require('./firebase-service-account.json');
} catch (error) {
  console.log('Firebase service account not found, using mock');
  serviceAccount = {
    projectId: 'mock-project',
    clientEmail: 'mock@example.com',
    privateKey: 'mock-key',
  };
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;