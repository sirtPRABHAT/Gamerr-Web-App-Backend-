const MoneyTransaction = require('../models/MoneyTransactionModel');
const PendingRequest = require('../models/pendingMoneyRequestModel');
const appError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

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
    return res.status(200).json({
      status: 'success',
      data: moneyTransactionObject,
    });
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
    return res.status(200).json({
      status: 'success',
      newTransaction: moneyTransactionObject,
      newPendingRequest: pendingRequestObject,
    });
  }
});
