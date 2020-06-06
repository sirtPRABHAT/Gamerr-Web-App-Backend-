const express = require('express');
const viewsController = require('../controller/viewsController');
const authController = require('../controller/authController');
const purchaseController = require('../controller/purchaseController');

const Router = express.Router();

Router.route('/').get(
  purchaseController.createPurchaseCheckOut,
  authController.isLoggedIn,
  viewsController.getOverview
);
Router.route('/login').get(authController.isLoggedIn, authController.login);
Router.route('/gameId/:slug').get(
  authController.isLoggedIn,
  viewsController.getGame
);
Router.route('/roomId/:gameId').get(
  authController.isLoggedIn,
  authController.protect,
  viewsController.getroomId
);

Router.route('/game/chat').get(viewsController.getChatBox);

module.exports = Router;
