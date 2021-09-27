const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const appError = require('../utils/appError');
const { promisify } = require('util');
const Email = require('../utils/email');
const crypto = require('crypto');

const tokenGenerator = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, status, req, res, link_render = false) => {
  const token = tokenGenerator(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ), //days -> hour ->min ->sec ->millisec
    httpOnly: true, // due to this we can not change cookie in browser
  };

  //if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  //cookieOptions.secure = true, means cookie will only sent to secure connection that is https connection
  if (req.secure || req.headers['x-forwarded-proto'] === 'https')
    cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  //this is to remove password field from signup document output
  user.password = undefined;
  if (!link_render) {
    res.status(status).json({
      status: 'Success',
      token,
      data: {
        user,
      },
    });
  } else {
    //NOTE this if else is for reedirecting signUp link
    //TODO in prod and dev url is different
    res.redirect('https://geekgamerr.herokuapp.com/');
  }
};

exports.logout = (req, res, next) => {
  res.cookie('jwt', 'loggedout', {
    httpOnly: true,
    expires: new Date(Date.now() + 10 * 1000),
  });

  res.status(200).json({ status: 'success' });
};

exports.signupOtp = catchAsync(async (req, res, next) => {
  const otp = (random =
    Math.floor(Math.random() * (99999 - 11111 + 1)) + 11111);
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    active: false,
    otp,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  console.log(newUser);

  await new Email(newUser, otp).sendWelcome();

  res.status(200).json({
    status: 'success',
  });
});

exports.resendOtp = catchAsync(async (req, res, next) => {
  user_email = req.body.email;
  user = await User.findOne({ email: user_email });
  user_otp = user.otp;

  // console.log(user);
  await new Email(user, user_otp).sendWelcome();
  res.status(200).json({
    status: 'success',
  });
});

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.findOneAndUpdate(
    { email: req.body.email, otp: req.body.otp },
    { active: true, otp: -1 },
    { new: true }
  );
  if (!user) {
    return res.json({
      status: 'failed',
      message: 'Otp is incorrect',
    });
  }
  createSendToken(user, 201, req, res);
});

exports.signupLink = catchAsync(async (req, res) => {
  const user = await User.findOneAndUpdate(
    { email: req.query.email, otp: req.query.otp },
    { active: true, otp: -1 },
    { new: true }
  );
  if (!user) {
    return res.json({
      status: 'failed',
      message: 'Otp is incorrect',
    });
  }
  createSendToken(user, 201, req, res, true);
  console.log(req.query);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new appError('Please provide email and password', 400));
  }

  const user = await User.findOne({ email, active: true }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new appError('Email or password is not correct', 400));
  }

  createSendToken(user, 201, req, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new appError('You are not logged, please loggin, and try again.', 401)
    );
  }

  // token verification
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const freshUser = await User.findById(decoded.id);

  //check if user exists or not
  if (!freshUser) {
    return next(
      new appError('The user belonging to this token no longer exists', 401)
    );
  }

  //check if user changed password after token created
  //decoded.iat provide issued at time
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new appError('User recently changed password ! Please log in again', 401)
    );
  }

  req.user = freshUser;
  res.locals.user = freshUser; // NOTE every template have access to res.locals so we put it here to use it there
  next();
});

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // token verification
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      const freshUser = await User.findById(decoded.id);

      //check if user exists or not
      if (!freshUser) {
        req.user = 'null';
        return next();
      }

      //check if user changed password after token created
      //decoded.iat provide issued at time
      if (freshUser.changedPasswordAfter(decoded.iat)) {
        req.user = 'null';
        return next();
      }

      req.user = freshUser;
      res.locals.user = freshUser; // NOTE every template have access to res.locals so we put it here to use it there

      return next();
    } catch (err) {
      req.user = 'null';
      return next();
    }
  }

  req.user = 'null';
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new appError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new appError('No user found with this email'), 404);
  }

  //user is a document of User model so it has access to all methods which are defined on UserSchema.methods

  const resetToken = user.createPasswordResetToken();
  //above method modified the user document but never save it to database, so save it below
  await user.save({ validateBeforeSave: false });
  //while saving it gives error because it runs validator before saving and because all mandotory fields are not defined, it gives error
  //so pass option to turn off validator

  //Send token to user via email
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/users/resetPassword/${resetToken}`;

  try {
    await new Email(user, resetUrl).sendPasswordReset();
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new appError(err, 500));
  }

  res.status(200).json({
    status: 'success',
    message: 'message sent to your email',
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //decrypt the given token to compare it with decrypted token stoerd in database
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  //find user with token and expired parameters in database
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gte: Date.now() }, //mongoose conver Date.now in appropriate form
  });

  if (!user) {
    return next(new appError('Invalid or expired token', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save(); //sometimes token generated before user save , so pre method on save changePassword time -1sec
  // const token = tokenGenerator(user._id);
  // res.status(200).json({
  //   status: 'Success',
  //   token,
  // });
  createSendToken(user, 200, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new appError('Your current password is wrong', 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createSendToken(user, 200, req, res);
});
