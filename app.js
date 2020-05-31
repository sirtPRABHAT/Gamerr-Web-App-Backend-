const express = require('express');
const morgan = require('morgan');
const gameRouter = require('./routes/gameRoutes');
const userRouter = require('./routes/userRoutes');
const viewRoute = require('./routes/viewRoute');
const purchaseRouter = require('./routes/purchaseRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const cookieParser = require('cookie-parser');
const pug = require('pug');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'To many request from this IP, please try again in an hour',
});

//Middlewares

// 1) This middleware set security http header
app.use(helmet());

// 2) Only used in development mode to log some req. data
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 3) This middleware restrict number of request from an IP in an hour
app.use('/api', limiter);

// 4) by default express doesn't attach body to the req, hence this middleware adds body to req and we also defined limit for input data in options
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' })); //for getting body from form submission, as their url contains body
app.use(cookieParser());
app.use((req, res, next) => {
  // console.log(req.cookies);
  next();
});

// 5) data sanitization against Nosql query injection
app.use(mongoSanitize());

// 6) data sanitization against XSS
app.use(xss());

// 7) prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'difficulty',
      'price',
      'maxGroupSize',
    ],
  })
);

// 8) Used to render static files
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', viewRoute);

// 9) this middleware for only /user, /tours path
app.use('/api/users', userRouter);
app.use('/api/games', gameRouter);
app.use('/api/purchase', purchaseRouter);
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Request ${req.originalUrl} does not found on this server`,
  // });
  // err = new Error(`Request ${req.originalUrl} does not found on this server`); //value in bracket is err.message
  // err.statusCode = 404;
  // err.status = 'fail';

  // next(err); //next with parameter skips all next middleware and jumps to err middleware
  next(
    new AppError(
      `Request ${req.originalUrl} does not found on this server`,
      404
    )
  );
});

//middleware function with err argument is error middleware
app.use(globalErrorHandler);

module.exports = app;
