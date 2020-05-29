const express = require('express');
const reviewController = require('../controller/reviewController');
const authController = require('../controller/authController');

//Router
const Router = express.Router({ mergeParams: true }); //mergeParams reserve the value of params from parent route

Router.use(authController.protect);

Router.route('/').get(authController.protect, reviewController.getAllReviews);
Router.route('/').post(
  authController.restrictTo('user'),
  reviewController.addTourUserIds,
  reviewController.createReview
);

Router.route('/:id')
  .get(reviewController.getReview)
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  )
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  );
module.exports = Router;
