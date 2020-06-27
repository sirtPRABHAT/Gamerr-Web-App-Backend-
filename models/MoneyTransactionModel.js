const mongoose = require('mongoose');

const moneyTransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Money transaction must belong to a user'],
  },
  paytmMobile: {
    type: String,
    required: [true, 'Must have paytm mobile no. for transaction'],
  },
  amount: {
    type: Number,
    required: [true, 'Must have amount for transaction'],
  },
  transactionType: {
    type: String,
    required: [true, 'Must have type'],
  },
  transactionAt: {
    type: Date,
    default: Date.now(),
  },
  pending: {
    type: Boolean,
    required: [true, 'Must have pending status'],
  },
});

moneyTransactionSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name',
  });
});

const MoneyTransaction = mongoose.model(
  'MoneyTransaction',
  moneyTransactionSchema
);

module.exports = MoneyTransaction;
