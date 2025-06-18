const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  try {
    const Transaction = require('./models/Transaction');
    const transactions = await Transaction.find({}).limit(5);
    console.log('Current transactions in database:');
    console.log(JSON.stringify(transactions, null, 2));
    console.log(`Total transactions: ${await Transaction.countDocuments()}`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    mongoose.disconnect();
  }
}); 