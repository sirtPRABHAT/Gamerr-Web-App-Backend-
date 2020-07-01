const express = require('express');
const purchaseController = require('../controller/purchaseController');
const authController = require('../controller/authController');

const Router = express.Router();

Router.get(
  '/checkout-session/:gameId',
  authController.protect,
  purchaseController.getCheckOutSession
);

//android specific route
Router.post(
  '/joinGame',
  authController.protect,
  purchaseController.joiningGame
);
module.exports = Router;
