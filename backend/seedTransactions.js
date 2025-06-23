const mongoose = require('mongoose');
const Transaction = require('./models/Transaction');
const User = require('./models/User');

// Connect to MongoDB
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const demoTransactions = [
  {
    amount: 5000,
    type: 'payment',
    description: 'Health Card Payment - Consultation and Tests',
    status: 'completed',
    hospital: 'City General Hospital',
    date: new Date('2023-11-25T10:30:00.000Z')
  },
  {
    amount: 2500,
    type: 'payment',
    description: 'Emergency Room Charges',
    status: 'completed',
    hospital: 'City General Hospital',
    date: new Date('2023-11-20T14:15:00.000Z')
  },
  {
    amount: 1800,
    type: 'charge',
    description: 'Prescription Medications',
    status: 'completed',
    hospital: 'Medicare Pharmacy',
    date: new Date('2023-11-15T09:45:00.000Z')
  },
  {
    amount: 3500,
    type: 'payment',
    description: 'Laboratory Tests Package',
    status: 'completed',
    hospital: 'City General Hospital',
    date: new Date('2023-11-10T11:20:00.000Z')
  },
  {
    amount: 1200,
    type: 'charge',
    description: 'Physiotherapy Session',
    status: 'completed',
    hospital: 'Wellness Clinic',
    date: new Date('2023-11-05T16:30:00.000Z')
  },
  {
    amount: 8000,
    type: 'payment',
    description: 'Surgery Consultation Fee',
    status: 'completed',
    hospital: 'City General Hospital',
    date: new Date('2023-11-01T13:00:00.000Z')
  },
  {
    amount: 1500,
    type: 'refund',
    description: 'Refund for Canceled Appointment',
    status: 'completed',
    hospital: 'City General Hospital',
    date: new Date('2023-10-28T10:00:00.000Z')
  },
  {
    amount: 4200,
    type: 'payment',
    description: 'Dental Treatment',
    status: 'pending',
    hospital: 'Dental Care Center',
    date: new Date('2023-10-25T15:45:00.000Z')
  },
  {
    amount: 3000,
    type: 'charge',
    description: 'X-Ray and Imaging',
    status: 'completed',
    hospital: 'City General Hospital',
    date: new Date('2023-10-20T08:30:00.000Z')
  },
  {
    amount: 6000,
    type: 'payment',
    description: 'Cardiology Consultation',
    status: 'failed',
    hospital: 'Heart Care Institute',
    date: new Date('2023-10-15T12:00:00.000Z')
  }
];

const seedTransactions = async () => {
  try {
    console.log('Starting transaction seeding...');

    // Get a user to associate transactions with
    const user = await User.findOne({});
    if (!user) {
      console.log('No users found. Please run the main seed script first.');
      return;
    }

    // Clear existing transactions
    await Transaction.deleteMany({});
    console.log('Cleared existing transactions');

    // Add user reference to all transactions
    const transactionData = demoTransactions.map(transaction => ({
      ...transaction,
      user: user._id
    }));

    // Insert transactions
    const createdTransactions = await Transaction.insertMany(transactionData);
    console.log(`Inserted ${createdTransactions.length} transactions`);

    console.log('Transaction seeding completed successfully');
    console.log(`Transactions are associated with user: ${user.email}`);
    
  } catch (err) {
    console.error('Error seeding transactions:', err);
  } finally {
    mongoose.disconnect();
    console.log('Database connection closed');
  }
};

seedTransactions(); 