const express = require('express');
const gameController = require('../controller/gameController');
const authController = require('../controller/authController');
const reviewRouter = require('./reviewRoute');

//Router
const Router = express.Router();

// Router.route('/:tourId/reviews').post(
//   authController.protect,
//   authController.restrictTo('user'),
//   reviewController.createReview
// );

Router.use('/:tourId/reviews', reviewRouter);

//Router.param('id', tourController.checkId); //direct param at --> /:id ==> id  //param middleware

// Router.route('/top-5-cheap').get(
//   tourController.aliasTopTours,
//   tourController.getAllTour
// );

Router.route('/').get(gameController.getAllGame).post(
  // authController.protect,
  // authController.restrictTo('admin', 'lead-guide', 'user'),
  gameController.createGame
);
Router.route('/:id').get(gameController.getGame);
// .patch(
//   authController.protect,
//   authController.restrictTo('admin', 'lead-guide'),
//   gameController.updateTour
// )
// .delete(
//   authController.protect,
//   authController.restrictTo('admin', 'lead-guide'),
//   gameController.deleteTour
// );

//module export
module.exports = Router;
