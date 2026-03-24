const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const pool = require("../db/pool");
const bcrypt = require("bcryptjs");

const customFields = {
  usernameField: "email", // passport will retrieve req.body.email instead of req.body.username
};

const verifyCallback = async (email, password, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    const user = rows[0];

    if (!user) {
      return done(null, false, { message: "Incorrect e-mail!" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return done(null, false, { message: "Incorrect password!" });
    }

    return done(null, user);
  } catch (err) {
    done(err);
  }
};

// Instantiate strategy with the right parameters
const strategy = new LocalStrategy(customFields, verifyCallback);

// PASSPORT CONFIG
passport.use(strategy);

passport.serializeUser((user, done) => {
  //  We serialize then pass user.id to req.login() via done()
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id=$1", [id]);
    const user = rows[0];
    done(null, user);
  } catch (err) {
    done(err);
  }
});
