const Games = require('../models/gameModel');
const appError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Users = require('../models/userModel');

exports.getOverview = catchAsync(async (req, res, next) => {
  const games = await Games.find();
  console.log(games[0].startDates);
  res.status(200).render('overview', {
    title: 'All Games',
    games,
  });
});

exports.getGame = catchAsync(async (req, res, next) => {
  const game = await Games.findOne({ slug: req.params.slug }).populate({
    path: 'players_participated',
    select: '-__v -role',
  });
  if (!game) {
    next(new appError('No Game found with that name', 500));
  }
  // console.log(game.players_participated[0]);
  // const participants = game.players_participated.map(async (element) => {
  //   await Users.findById(element);
  // });
  console.log(game);
  res.status(200).render('game', {
    title: 'Free Fire',
    game,
  });
});

exports.getroomId = async (req, res, next) => {
  const gameId = req.params.gameId;
  const {
    roomId,
    startDates,
    players_participated,
    slug,
  } = await Games.findById(gameId);
  showTime = startDates.getTime() / 1000;
  checkTime = new Date().getTime() / 1000;
  console.log(req.user._id);
  console.log(players_participated);
  if (players_participated.includes(req.user._id)) {
    if (checkTime > showTime) {
      res.render('error', {
        redirect: `/gameId/${slug}`,
        heading: 'ROOM_ID',
        message: `Here is your roomId-${roomId}, for game ${slug}. Please be on time`,
      });
      //console.log((checkTime - showTime) / 60);
    } else {
      res.render('error', {
        redirect: `/gameId/${slug}`,
        heading: 'ERROR',
        message: 'Please come before 10 minutes of game start.',
      });
    }
  } else {
    res.render('error', {
      redirect: `/gameId/${slug}`,
      heading: 'Error',
      message: 'Please purchase the game first',
    });
  }
};
