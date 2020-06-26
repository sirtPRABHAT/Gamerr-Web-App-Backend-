const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const appError = require('../utils/appError');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};

//request handlers

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new appError('This route is not for updating password', 401));
  }

  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    updatedUser,
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

exports.deleteMe = catchAsync(async (req, res, next) => {
  console.log(req.body);
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateCoin = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, {
    coins: req.body.amount,
  });
  if (!user) {
    return res.status(202).json({
      status: 'failed',
    });
  }
  res.status(200).json({
    status: 'success',
    coin: req.body.amount,
  });
});

exports.createUser = factory.createOne(User);
exports.getAllUser = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
