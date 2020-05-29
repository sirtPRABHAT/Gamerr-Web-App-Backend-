const appError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = (model) => {
  //this function return inner function
  return catchAsync(async (req, res, next) => {
    const doc = await model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new appError('No tour found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        message: 'Tour deleted successfully',
      },
    });
  });
};

exports.updateOne = (model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new appError('No document found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
};

exports.createOne = (model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
};

exports.getOne = (model, populateOptions) => {
  return catchAsync(async (req, res, next) => {
    let query = await model.findById(req.params.id);
    if (populateOptions) query.populate(populateOptions);
    const doc = await query;
    if (!doc) {
      return next(new appError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });
};

exports.getAll = (model) => {
  return catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    // Executing query
    const features = new APIFeatures(model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query;
    res.status(200).json({
      status: 'success',
      length: doc.length,
      data: {
        doc,
      },
    });
  });
};
