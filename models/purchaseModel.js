const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  gameId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Games',
    required: [true, 'Purchase must belong to a game'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Purchase must belong to a user'],
  },
  price: {
    type: Number,
    required: [true, 'Purchase must have a price'],
  },
  purchasedAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

purchaseSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name',
  });
  this.populate({
    path: 'gameId',
    select: 'name',
  });
});

const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;
