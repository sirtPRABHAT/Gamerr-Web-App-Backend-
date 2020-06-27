const mongoose = require('mongoose');

const pendingMoneyRequestSchema = new mongoose.Schema({
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
  requestAt: {
    type: Date,
    default: Date.now(),
  },
  pending: {
    type: Boolean,
    required: [true, 'Must have pending status'],
    default: true,
  },
});

pendingMoneyRequestSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name',
  });
});

const PendingMoneyRequest = mongoose.model(
  'PendingMoneyRequest',
  pendingMoneyRequestSchema
);

module.exports = PendingMoneyRequest;
