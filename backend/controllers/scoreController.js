const Score = require("../models/scores");

async function index(req, res) {
  try {
    console.log("Controller called");
    const scoreEntry = await Score.all;
    res.status(200).json(scoreEntry);
  } catch (err) {
    res.status(500).send(err);
  }
}

async function show(req, res) {
  try {
    const scoreEntry = await Score.findByUserName(req.params.id);
    console.log(req.params);
    res.status(200).json(scoreEntry);
  } catch (err) {
    res.status(404).json({ err });
  }
}

async function create(req, res) {
  try {
    const scoreEntry = await Score.create(req.body);
    console.log(req.body, "Req body here");
    res.status(201).json(scoreEntry);
  } catch (err) {
    res.status(422).json({ err });
  }
}

module.exports = { index, show, create };
