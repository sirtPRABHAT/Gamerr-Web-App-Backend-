const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please tell us  your name'],
  },
  email: {
    type: String,
    required: [true, 'please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'please provide a valid email'],
  },
  coins: {
    type: Number,
    default: 0,
  },
  cash: {
    type: Number,
    default: 0,
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  active: {
    type: String,
    default: true,
    select: false,
  },
  password: {
    type: String,
    required: [true, 'please provide a password'],
    minlength: 8,
    select: false, //now it will not show by default in any query result
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please confirm your password'],
    validate: {
      //this validation only works for save or create methods, not on update so do not use update on password related works intead use save()
      validator: function (password_confirmed_entered_by_user) {
        return password_confirmed_entered_by_user === this.password;
      },
      message: 'passwords are not matched!!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

//document middleware
//in document middleware this points to document being updated
//these are middlewares execute pre/post on specified method like 'save==oncreate' but this not run on update
// 1)
userSchema.pre('save', async function (next) {
  //every middleware has access to funxtion next()
  if (!this.isModified('password')) return next(); // on creatting new user then alaso it's password is considered as modified
  this.password = await bcrypt.hash(this.password, 7);
  this.passwordConfirm = undefined;
  next();
});

// 2)
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

//these are query middleware
//in query middleware this points to query result
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } }); //this line add find({active:true}) query to query pointed by this (all query starts with find)
  next();
});
//these function attached to every document which are instance of this schema
// 1)
userSchema.methods.correctPassword = async function (
  candidatePawword,
  userPassword
) {
  return await bcrypt.compare(candidatePawword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

//2)
userSchema.methods.createPasswordResetToken = function () {
  resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = new mongoose.model('User', userSchema);

module.exports = User;
