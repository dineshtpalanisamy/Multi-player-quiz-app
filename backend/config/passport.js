const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

// Local Strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      console.log("email :", email);
      console.log("password :", password);
      const dbUser = await User.findOne({ email });
      if (!dbUser) {
        return done(null, false, {
          message: "Incorrect Email or Password",
        });
      } else {
        const isCorrect = await dbUser.checkPassword(password);
        if (!isCorrect) {
          return done(null, false, {
            message: "Incorrect Email or Password",
          });
        } else {
          console.log("everthing is correct");
          return done(null, dbUser);
        }
      }
    }
  )
);

passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((obj, cb) => cb(null, obj));

module.exports = passport;
