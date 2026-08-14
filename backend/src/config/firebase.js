const admin = require('firebase-admin');

// Try to load service account, use mock if not available
let serviceAccount;
try {
  serviceAccount = require('./firebase-service-account.json');
} catch (error) {
  console.log('Firebase service account not found, using mock config');
  serviceAccount = {
    type: 'service_account',
    project_id: 'mock-project',
    private_key_id: 'mock',
    private_key: '-----BEGIN PRIVATE KEY-----\nMOCKKEY\n-----END PRIVATE KEY-----\n',
    client_email: 'mock@mock.iam.gserviceaccount.com',
    client_id: 'mock',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
  };
}

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;