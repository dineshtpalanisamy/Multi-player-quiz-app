const Game = require("../models/game");
const db = require("../models");

const findAllGames = async (req, res) => {
  try {
    const data = await Game.find();
    res.status(200).send(data);
  } catch (err) {
    console.log("error message : ", err);
    res.status(422).json(err);
  }
};

const findGameById = async (req, res) => {
  try {
    const data = await Game.findById(req.params.gameId);
    res.status(200).send(data);
  } catch (err) {
    console.log("error message : ", err);
    res.status(422).json(err);
  }
};

const findSessionAndGameById = (req, res) => {
  var sessionGameData = {};

  findGameById(req.params.gameId)
    .then((gameObj) => {
      sessionGameData.game = gameObj;
      return Promise.resolve();
    })
    .then(() => db.Session.findById(req.params.sessionId))
    .then((sessionObj) => {
      sessionGameData.session = sessionObj;
      res.json(sessionGameData);
    })
    .catch((err) => res.status(422).json(err));
};

const home = async (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  } catch (e) {
    res.status(500).send({ e: "Cannot load the highscores" });
  }
};

const setGame = async (req, res) => {
  try {
    const { categoryId, difficulty, range } = req.params;
    const newgame = await Game.create(categoryId, difficulty, range);
    res.status(200).json(newgame);
  } catch (e) {
    res.status(500).send({ e: "Cannot start the game!" });
  }
};

module.exports = {
  findAllGames,
  findGameById,
  findSessionAndGameById,
  home,
  setGame,
};
