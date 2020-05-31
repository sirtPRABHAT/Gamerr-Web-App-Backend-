const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Games = require('../models/gameModel');
const appError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getCheckOutSession = catchAsync(async (req, res, next) => {
  console.log(req.user);
  const game = await Games.findById(req.params.gameId);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/`,
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
