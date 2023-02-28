const express = require("express");
const router = express.Router();
const {
  findAll,
  findById,
  findOneByEmail,
  updateOne,
  updateUserScore,
  addwinScore,
  addlossScore,
} = require("../../controllers/userController");

router.route("/email/:email").get(findOneByEmail);
router.route("/score/:id").put(updateUserScore);
router.route("/add-win/:id").get(addwinScore);
router.route("/add-loss/:id").get(addlossScore);
router.route("/:id").get(findById);
router.route("/").post(updateOne).get(findAll);
router.route("/").get(findAll);

module.exports = router;
