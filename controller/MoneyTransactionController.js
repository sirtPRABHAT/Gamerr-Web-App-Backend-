const MoneyTransaction = require('../models/MoneyTransactionModel');
const PendingRequest = require('../models/pendingMoneyRequestModel');
const appError = require('../utils/appError');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const { find } = require('../models/MoneyTransactionModel');

exports.createMoneyTransaction = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { paytmMobile, amount, pending, transactionType } = req.body;
  if (transactionType === 'debit') {
    const moneyTransactionObject = await MoneyTransaction.create({
      userId,
      paytmMobile,
      amount,
      transactionType: 'debit',
      pending: false,
    });
    if (moneyTransactionObject) {
      return res.status(200).json({
        status: 'success',
        data: moneyTransactionObject,
      });
    } else {
      return res.status(500).json({
        status: 'failed',
      });
    }
  } else if (transactionType === 'credit') {
    const moneyTransactionObject = await MoneyTransaction.create({
      userId,
      paytmMobile,
      amount,
      transactionType: 'credit',
      pending: true,
    });
    const pendingRequestObject = await PendingRequest.create({
      userId,
      paytmMobile,
      amount,
    });

    if (moneyTransactionObject && pendingRequestObject) {
      const transaction_user = await User.findById(userId);
      final_cash = transaction_user.cash - amount;
      await User.findByIdAndUpdate(userId, { cash: final_cash });
      return res.status(200).json({
        status: 'success',
        newTransaction: moneyTransactionObject,
        newPendingRequest: pendingRequestObject,
      });
    } else {
      return res.status(500).json({
        status: 'failed',
      });
    }
  }
});

exports.getMyTransactions = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const userTransactions = await MoneyTransaction.find({ userId }).sort({
    transactionAt: 'desc',
  });
  // if (!userTransactions) {
  //   return res.status(500).json({
  //     status: 'failed',
  //     data: null,
  //   });
  // }
  res.status(200).json({
    status: 'success',
    data: userTransactions,
  });
});
