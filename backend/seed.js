const mongoose = require('mongoose');
const User = require('./models/User');
const Loan = require('./models/Loan');
const fs = require('fs');

// Read only users and loans seed data
const users = JSON.parse(fs.readFileSync('./seed/demoUsers.json', 'utf8'));
const loans = JSON.parse(fs.readFileSync('./seed/demoLoans.json', 'utf8'));

// Connect to MongoDB
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Clear only users and loans
    await User.deleteMany({});
    await Loan.deleteMany({});
    
    console.log('Cleared existing users and loans');

    // Insert users
    const createdUsers = await User.insertMany(users);
    console.log(`Inserted ${createdUsers.length} users`);
    
    // Map user emails to their IDs for reference
    const userMap = {};
    createdUsers.forEach(user => {
      userMap[user.email] = user._id;
    });

    // Insert loans with proper user references
    const loanData = loans.map(loan => {
      if (loan.userEmail && userMap[loan.userEmail]) {
        loan.user = userMap[loan.userEmail];
        delete loan.userEmail;
      }
      return loan;
    });
    
    const createdLoans = await Loan.insertMany(loanData);
    console.log(`Inserted ${createdLoans.length} loans`);

    console.log('Database seeding completed successfully');
    console.log('Sample patient credentials for testing:');
    console.log('Email: patient@demo.com, Password: password123');
    
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    mongoose.disconnect();
    console.log('Database connection closed');
  }
};

seedDatabase();
