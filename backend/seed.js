
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Models
const User = require('./models/User');
const Hospital = require('./models/Hospital');
const HealthCard = require('./models/HealthCard');
const Loan = require('./models/Loan');
const Transaction = require('./models/Transaction');
const Notification = require('./models/Notification');

// Data
const demoUsers = require('./seed/demoUsers.json');
const demoHospitals = require('./seed/demoHospitals.json');
const demoHealthCards = require('./seed/demoHealthCards.json');
const demoLoans = require('./seed/demoLoans.json');
const demoTransactions = require('./seed/demoTransactions.json');
const demoNotifications = require('./seed/demoNotifications.json');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
    return true;
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create users
    const users = await User.create(demoUsers);
    console.log(`Seeded ${users.length} users`);
    return users;
  } catch (err) {
    console.error('Error seeding users:', err);
    process.exit(1);
  }
};

const seedHospitals = async (users) => {
  try {
    // Clear existing hospitals
    await Hospital.deleteMany({});
    console.log('Cleared existing hospitals');

    // Get hospital user
    const hospitalUser = users.find(user => user.role === 'hospital');
    
    // Create hospitals with proper user reference
    const hospitals = await Promise.all(
      demoHospitals.map(async (hospital) => {
        return Hospital.create({
          ...hospital,
          user: hospitalUser._id
        });
      })
    );
    console.log(`Seeded ${hospitals.length} hospitals`);
    return hospitals;
  } catch (err) {
    console.error('Error seeding hospitals:', err);
    process.exit(1);
  }
};

const seedHealthCards = async (users) => {
  try {
    // Clear existing health cards
    await HealthCard.deleteMany({});
    console.log('Cleared existing health cards');

    // Get patient user
    const patientUser = users.find(user => user.role === 'patient');
    
    // Create health cards with proper user reference
    const healthCards = await Promise.all(
      demoHealthCards.map(async (card) => {
        return HealthCard.create({
          ...card,
          user: patientUser._id
        });
      })
    );
    console.log(`Seeded ${healthCards.length} health cards`);
    return healthCards;
  } catch (err) {
    console.error('Error seeding health cards:', err);
    process.exit(1);
  }
};

const seedLoans = async (users) => {
  try {
    // Clear existing loans
    await Loan.deleteMany({});
    console.log('Cleared existing loans');

    // Get patient user
    const patientUser = users.find(user => user.role === 'patient');
    
    // Create loans with proper user reference
    const loans = await Promise.all(
      demoLoans.map(async (loan) => {
        return Loan.create({
          ...loan,
          user: patientUser._id
        });
      })
    );
    console.log(`Seeded ${loans.length} loans`);
    return loans;
  } catch (err) {
    console.error('Error seeding loans:', err);
    process.exit(1);
  }
};

const seedTransactions = async (users) => {
  try {
    // Clear existing transactions
    await Transaction.deleteMany({});
    console.log('Cleared existing transactions');

    // Get patient user
    const patientUser = users.find(user => user.role === 'patient');
    
    // Create transactions with proper user reference
    const transactions = await Promise.all(
      demoTransactions.map(async (transaction) => {
        return Transaction.create({
          ...transaction,
          user: patientUser._id
        });
      })
    );
    console.log(`Seeded ${transactions.length} transactions`);
    return transactions;
  } catch (err) {
    console.error('Error seeding transactions:', err);
    process.exit(1);
  }
};

const seedNotifications = async (users) => {
  try {
    // Clear existing notifications
    await Notification.deleteMany({});
    console.log('Cleared existing notifications');

    // Get patient user
    const patientUser = users.find(user => user.role === 'patient');
    
    // Create notifications with proper user reference
    const notifications = await Promise.all(
      demoNotifications.map(async (notification) => {
        return Notification.create({
          ...notification,
          user: patientUser._id
        });
      })
    );
    console.log(`Seeded ${notifications.length} notifications`);
    return notifications;
  } catch (err) {
    console.error('Error seeding notifications:', err);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    const connected = await connectDB();
    if (!connected) return;
    
    const users = await seedUsers();
    await seedHospitals(users);
    await seedHealthCards(users);
    await seedLoans(users);
    await seedTransactions(users);
    await seedNotifications(users);
    
    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();
