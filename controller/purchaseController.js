const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Games = require('../models/gameModel');
const Purchase = require('../models/purchaseModel');
const appError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getCheckOutSession = catchAsync(async (req, res, next) => {
  const game = await Games.findById(req.params.gameId);

  if (game.players_participated.includes(req.user._id)) {
    return res.status(200).send({
      alreadyPurchased: true,
      status: 'success',
    });
  }
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?gameId=${
      req.params.gameId
    }&user=${req.user._id}&price=${game.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/game/${game.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.gameId,
    line_items: [
      {
        name: `${game.name}`,
        description: game.description,
        images: ['https://i.ytimg.com/vi/pKUu6PKNyzk/maxresdefault.jpg'],
        amount: game.price * 100,
        currency: 'inr',
        quantity: 1,
      },
    ],
  });
  res.status(200).send({
    status: 'success',
    session,
  });
});

exports.createPurchaseCheckOut = catchAsync(async (req, res, next) => {
  const { gameId, user, price } = req.query;

  if (!gameId && !user && !price) return next();
  const game = await Games.findById(gameId);
  //const objId = mongoose.Types.ObjectId(user);
  const paricipated = game.players_participated;

  paricipated.push(user);

  await Games.findOneAndUpdate(
    { _id: gameId },
    { players_participated: paricipated }
  );

  await Purchase.create({ gameId, user, price });
  res.redirect(req.originalUrl.split('?')[0]);
});
