const express = require('express');
const purchaseController = require('../controller/purchaseController');
const authController = require('../controller/authController');
const paytm = require('../controller/paytm');

const Router = express.Router();

Router.get(
  '/checkout-session/:gameId',
  authController.protect,
  purchaseController.getCheckOutSession
);

//Router.get('/paytm', paytm.getToken);

module.exports = Router;
