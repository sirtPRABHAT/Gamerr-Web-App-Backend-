const express = require('express');
const moneyTransactionController = require('../controller/MoneyTransactionController');
const authController = require('../controller/authController');

const Router = express.Router();

Router.post(
  '/newTransaction',
  authController.protect,
  moneyTransactionController.createMoneyTransaction
);

Router.get(
  '/myTransaction',
  authController.protect,
  moneyTransactionController.getMyTransactions
);
module.exports = Router;
