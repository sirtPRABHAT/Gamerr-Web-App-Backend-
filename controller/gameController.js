const Games = require('../models/gameModel');

const appError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

// exports.aliasTopTours = (req, res, next) => {
//   (req.query.limit = '5'),
//     (req.query.sort = '-ratingsAverage,price'),
//     (req.query.fields = 'name,price,ratingsAverage,summary,difficulty');
//   next();
// };

//Request handlers
exports.getAllGame = factory.getAll(Games);
exports.createGame = factory.createOne(Games);
exports.getGame = factory.getOne(Games);
exports.updateTour = factory.updateOne(Games);
exports.deleteTour = factory.deleteOne(Games);
