const express = require("express");
const router = express.Router();
const {
  findAllGames,
  findGameById,
  findSessionAndGameById,
  home,
  setGame,
} = require("../../controllers/gameController");

router.route("/").get(findAllGames);
router.route("/").get(home);
router.post("/game/:categoryId/:difficulty/:range", setGame);

router.route("/:gameId").get(findGameById);

module.exports = router;
