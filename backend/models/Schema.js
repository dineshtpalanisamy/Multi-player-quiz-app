const mongoose = require("mongoose");
const { Schema } = mongoose;

// const gameSchema = new Schema({
//   title: { type: String, required: true },
//   category: { type: String, required: true },
//   questions: { type: Array, default: [] },
// });

const gameSchema = new Schema({
  gameId: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    lowercase: true,
  },

  score: {
    type: String,
    min: [0, "Minimum score is 0"],
    default: 0,
  },
});

const Game = mongoose.model("Game", gameSchema);

module.exports = { Game };
