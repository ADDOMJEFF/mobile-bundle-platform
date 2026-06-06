const mongoose = require('mongoose');
const Bundle = require('./models/Bundle');
require('dotenv').config();

const bundles = [
  // MTN Data Bundles
  { name: 'MTN 1GB Data', network: 'MTN', type: 'data', description: '1GB high-speed data', amount: 10, dataVolume: '1GB', validity: '30 days', isActive: true },
  { name: 'MTN 3GB Data', network: 'MTN', type: 'data', description: '3GB high-speed data', amount: 25, dataVolume: '3GB', validity: '30 days', isActive: true },
  { name: 'MTN 5GB Data', network: 'MTN', type: 'data', description: '5GB high-speed data', amount: 40, dataVolume: '5GB', validity: '30 days', isActive: true },
  { name: 'MTN 10GB Data', network: 'MTN', type: 'data', description: '10GB high-speed data', amount: 70, dataVolume: '10GB', validity: '30 days', isActive: true },
  { name: 'MTN 20GB Data', network: 'MTN', type: 'data', description: '20GB high-speed data', amount: 120, dataVolume: '20GB', validity: '60 days', isActive: true },
  
  // MTN Voice Bundles
  { name: 'MTN 100 Mins', network: 'MTN', type: 'voice', description: '100 minutes to all networks', amount: 10, dataVolume: '', validity: '7 days', isActive: true },
  { name: 'MTN 250 Mins', network: 'MTN', type: 'voice', description: '250 minutes to all networks', amount: 25, dataVolume: '', validity: '14 days', isActive: true },
  { name: 'MTN 500 Mins', network: 'MTN', type: 'voice', description: '500 minutes to all networks', amount: 45, dataVolume: '', validity: '30 days', isActive: true },
  
  // Vodafone Data Bundles
  { name: 'Vodafone 1GB Data', network: 'Vodafone', type: 'data', description: '1GB high-speed data', amount: 10, dataVolume: '1GB', validity: '30 days', isActive: true },
  { name: 'Vodafone 3GB Data', network: 'Vodafone', type: 'data', description: '3GB high-speed data', amount: 25, dataVolume: '3GB', validity: '30 days', isActive: true },
  { name: 'Vodafone 5GB Data', network: 'Vodafone', type: 'data', description: '5GB high-speed data', amount: 38, dataVolume: '5GB', validity: '30 days', isActive: true },
  { name: 'Vodafone 10GB Data', network: 'Vodafone', type: 'data', description: '10GB high-speed data', amount: 65, dataVolume: '10GB', validity: '30 days', isActive: true },
  
  // Vodafone Voice Bundles
  { name: 'Vodafone 100 Mins', network: 'Vodafone', type: 'voice', description: '100 minutes to all networks', amount: 10, dataVolume: '', validity: '7 days', isActive: true },
  { name: 'Vodafone 300 Mins', network: 'Vodafone', type: 'voice', description: '300 minutes to all networks', amount: 28, dataVolume: '', validity: '30 days', isActive: true },
  
  // AirtelTigo Data Bundles
  { name: 'AirtelTigo 1GB Data', network: 'AirtelTigo', type: 'data', description: '1GB high-speed data', amount: 8, dataVolume: '1GB', validity: '30 days', isActive: true },
  { name: 'AirtelTigo 3GB Data', network: 'AirtelTigo', type: 'data', description: '3GB high-speed data', amount: 22, dataVolume: '3GB', validity: '30 days', isActive: true },
  { name: 'AirtelTigo 6GB Data', network: 'AirtelTigo', type: 'data', description: '6GB high-speed data', amount: 40, dataVolume: '6GB', validity: '30 days', isActive: true },
  
  // AirtelTigo Voice Bundles
  { name: 'AirtelTigo 150 Mins', network: 'AirtelTigo', type: 'voice', description: '150 minutes to all networks', amount: 12, dataVolume: '', validity: '14 days', isActive: true },
  { name: 'AirtelTigo 400 Mins', network: 'AirtelTigo', type: 'voice', description: '400 minutes to all networks', amount: 35, dataVolume: '', validity: '30 days', isActive: true },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    await Bundle.deleteMany({});
    console.log('Cleared existing bundles');

    await Bundle.insertMany(bundles);
    console.log(`${bundles.length} bundles added successfully!`);

    process.exit(0);
  } catch (error) {
    console.error('Seed Error:', error);
    process.exit(1);
  }
};

seedDB();