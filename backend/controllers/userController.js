const db = require("../models");
const User = require("../models/");

const findAll = async (req, res) => {
  try {
    console.log("came Inside user model");
    const data = await User.find(req.query);
    res.status(200).send(data);
  } catch (err) {
    console.log("error message : ", err);
    res.status(422).json(err);
  }
};

const findById = async (req, res) => {
  try {
    const data = await User.findById(req.params.id);
    res.status(200).send(data);
  } catch (err) {
    console.log("error message : ", err);
    res.status(422).json(err);
  }
};

const findOneByEmail = async (req, res) => {
  try {
    const data = await User.findOne({ email: req.params.email });
    res.status(200).send(data);
  } catch (err) {
    console.log("error message : ", err);
    res.status(422).json(err);
  }
};

const updateOne = async (req, res) => {
  try {
    const data = await User.findOneAndUpdate(
      { _id: req.body.id },
      {
        totalWins: req.body.wins,
        totalLosses: req.body.losses,
      },
      { new: true }
    );
    res.status(200).send(data);
  } catch (err) {
    console.log("error message : ", err);
    res.status(422).json(err);
  }
};

const updateUserScore = (req, res) => {
  db.User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return new Error("Could not find document");
      } else {
        // console.log(req.body);
        if (req.body.totalWins) {
          user.totalWins = user.totalWins + 1;
        } else if (req.body.totalLosses) {
          user.totalLosses = user.totalLosses + 1;
        }
        user.save().then((dbUser) => {
          req.login(dbUser, () => {
            res.json(dbUser);
          });
        });
      }
    })
    .catch((err) => res.status(422).json(err));
};
const addwinScore = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return new Error("Could not find document");
    } else {
      const data = await User.update(
        { _id: req.params.id },
        { totalWins: user.totalWins + 1 }
      );
      if (data) {
        res.send(true);
      }
    }
  } catch (err) {
    console.log("error message : ", err);
    res.status(422).json(err);
  }
};
const addlossScore = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return new Error("Could not find document");
    } else {
      const data = await User.update(
        { _id: req.params.id },
        { totalLosses: user.totalLosses + 1 }
      );
      if (data) {
        res.send(true);
      }
    }
  } catch (err) {
    console.log("error message : ", err);
    res.status(422).json(err);
  }
};

module.exports = {
  addlossScore,
  addwinScore,
  updateUserScore,
  updateOne,
  findOneByEmail,
  findById,
  findAll,
};
