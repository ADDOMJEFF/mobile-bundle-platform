// Firebase admin disabled - using mock auth
const admin = {
  apps: [],
  initializeApp: () => console.log('Firebase disabled'),
  credential: {
    cert: () => ({ mock: true }),
  },
};

module.exports = admin;