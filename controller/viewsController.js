const Games = require('../models/gameModel');
const Users = require('../models/userModel');

exports.getOverview = async (req, res, next) => {
  const games = await Games.find();
  console.log(games[0].startDates);
  res.status(200).render('overview', {
    title: 'All Games',
    games,
  });
};

exports.getGame = async (req, res, next) => {
  const game = await Games.findOne({ slug: req.params.slug }).populate({
    path: 'players_participated',
    select: '-__v -role',
  });
  // console.log(game.players_participated[0]);
  // const participants = game.players_participated.map(async (element) => {
  //   await Users.findById(element);
  // });
  console.log(game);
  res.status(200).render('game', {
    title: 'Free Fire',
    game,
  });
};

exports.getroomId = async (req, res, next) => {
  const gameId = req.params.gameId;
  const { roomId, startDates, players_participated } = await Games.findById(
    gameId
  );
  showTime = startDates.getTime() / 1000;
  checkTime = new Date().getTime() / 1000;
  console.log(req.user._id);
  console.log(players_participated);
  if (players_participated.includes(req.user._id)) {
    if (checkTime > showTime) {
      res.send(`here is your roomId-${roomId}`);
      //console.log((checkTime - showTime) / 60);
    } else {
      res.send('please come before 10 min of game start');
    }
  } else {
    res.send('please purchase first');
  }
};
