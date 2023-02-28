const express = require("express");
const router = express.Router();
const scoreController = require("../../controllers/scoreController");
const scoreRouter = express.Router();

scoreRouter.get("/", scoreController.index);
scoreRouter.get("/:id", scoreController.show);
scoreRouter.post("/", scoreController.create);
module.exports = scoreRouter;
