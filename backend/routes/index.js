const path = require("path");
const router = require("express").Router();
const apiRoutes = require("./api");
const db = require("../models");
const passport = require("../config/passport");

router.post("/register", (req, res) => {
  console.log("came inside ");
  db.User.create({
    username: req.body.username,
    picLink: req.body.picLink,
    email: req.body.email,
    password: req.body.password,
  })
    .then((newUser) => {
      res.redirect(307, "/login");
    })
    .catch((err) => {
      if (err.code === 11000) {
        res.status(401).json({ error: "That email already exists." });
      } else {
        res.json(err);
      }
    });
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  console.log(req.body);
  res.json(req.user);
});

router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.get("/user/me", function (req, res) {
  if (req.user) {
    res.json({
      email: req.user.email,
      name: req.user.name,
      picLink: req.user.picLink,
      name: req.user.username,
      wins: req.user.totalWins,
      losses: req.user.totalLosses,
      id: req.user._id,
    });
  } else {
    res.status(401).json({});
  }
});

router.use("/api", apiRoutes);

// router.use(function (req, res) {
//   res.sendFile(path.join(__dirname, "../client/index.html"));
// });

module.exports = router;
