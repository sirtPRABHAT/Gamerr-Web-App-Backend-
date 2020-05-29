const express = require('express');
const viewsController = require('../controller/viewsController');
const authController = require('../controller/authController');

const Router = express.Router();

Router.route('/').get(authController.isLoggedIn, viewsController.getOverview);
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

module.exports = Router;
