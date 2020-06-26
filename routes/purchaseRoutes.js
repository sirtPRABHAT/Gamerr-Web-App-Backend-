const express = require('express');
const purchaseController = require('../controller/purchaseController');
const authController = require('../controller/authController');

const Router = express.Router();

Router.get(
  '/checkout-session/:gameId',
  authController.protect,
  purchaseController.getCheckOutSession
);
Router.post(
  '/joinGame',
  authController.protect,
  purchaseController.purchasingGame
);
module.exports = Router;
