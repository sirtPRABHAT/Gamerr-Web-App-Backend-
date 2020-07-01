const express = require('express');
const userController = require('../controller/userController');
const authController = require('../controller/authController');

const Router = express.Router();

Router.post('/signupotp', authController.signupOtp);
Router.post('/resendOtp', authController.resendOtp);
Router.post('/signup', authController.signup);
Router.post('/login', authController.login);
Router.get('/logout', authController.logout);
Router.post('/forgotPassword', authController.forgotPassword);
Router.patch('/resetPassword/:token', authController.resetPassword);

//Now after this middleware all Router has protect  functionality
Router.use(authController.protect);
Router.patch('/updateCoin', authController.protect, userController.updateCoin);
Router.patch('/updateMyPassword', userController.updateMe);
Router.patch('/updateMe', userController.updateMe);
Router.delete('/deleteMe', userController.deleteMe);
Router.get('/getMe', userController.getMe, userController.getUser);

Router.use(authController.restrictTo('admin'));

Router.route('/')
  .get(userController.getAllUser)
  .post(userController.createUser);
Router.route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

//module export
module.exports = Router;
