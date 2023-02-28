const express = require("express");
const router = express();
const gameRoutes = require("./gameRoutes");
const userRoutes = require("./userRoutes");
const scoreRoutes = require("./scoreRoutes");

// Game routes

router.use("/game", gameRoutes);
router.use("/user", userRoutes);
router.use("/scores", scoreRoutes);

module.exports = router;
