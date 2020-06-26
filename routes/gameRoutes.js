const express = require('express');
const gameController = require('../controller/gameController');
const authController = require('../controller/authController');

//Router
const Router = express.Router();

Router.route('/')
  .get(gameController.getAllGame)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    gameController.createGame
  );
Router.route('/time').get(gameController.roomIdCheckTime); //be carefull /:id and /time respond for same endpont
Router.route('/:id').get(gameController.getGame);

//module export
module.exports = Router;
