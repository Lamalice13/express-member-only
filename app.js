const express = require("express");
const path = require("node:path");
const app = express();
const expressSession = require("express-session");
const pgSession = require("connect-pg-simple")(expressSession);
const signUpValidations = require("./middlewares/signUpValidations");
const signInValidations = require("./middlewares/signInValidations");
const pool = require("./db/pool");
const passport = require("passport");
const flash = require("connect-flash");
const isAuth = require("./middlewares/auth");
const bcrypt = require("bcryptjs");
// const hashCode = require("./utils/hashCode");
const { body, validationResult, matchedData } = require("express-validator");

// CONFIG
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(flash());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// CONFIG SESSION
app.use(
  expressSession({
    // We are configuring the store to be the database and not the server memory.
    store: new pgSession({
      pool: pool,
      createTableIfMissing: true,
    }),
    // saveUninitiliazed:  If req.session has not been modified by req.login() or passport.authentificate() (by adding passport obj to the req.session), the session will not be saved to the store (in the database).
    // The req.session will still be created in the node memory RAM however, and a set-cookie sent to the browser.
    saveUninitialized: false,
    resave: false,
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // Last for 24 hours before re login
  })
);

// EXECUTE PASSPORT CONFIG
require("./config/passport");

// For every requests after the login, calls deserializeUser() which retrieves user informations from req.session, gives the results
// And passport populates req.user with the result.
// So, it allows us to retrieve the user based on the cookie sent by browser (via req.session which is reconstructed each request by express-session).
app.use(passport.session());

app.use((req, res, next) => {
  // req.user is now avaible in req.locals.currentUser which exempts us to send users information to our views.
  res.locals.currentUser = req.user;
  next();
});

// ROUTES

// ROUTE FORM-MESSAGE
app
  .route("/form-message")
  .get((req, res) => {
    res.render("form-message");
  })
  .post(
    body("text", "Your message has to be between 20 and 100 length")
      .trim()
      .isLength({ min: 20, max: 100 }),
    async (req, res, next) => {
      const error = validationResult(req);

      if (!error.isEmpty())
        return res.render("form-message", { error: error.array() });

      try {
        const { text } = matchedData(req);
        await pool.query("INSERT INTO posts(user_id, text) VALUES($1, $2)", [
          req.user.id,
          text,
        ]);
        return res.redirect("/");
      } catch (err) {
        next(err);
      }
    }
  );

// ROUTE HOME PAGE
app.route("/").get(async (req, res) => {
  let user;
  let posts;
  if (req.isAuthenticated()) {
    const postsDb = await pool.query(
      "SELECT firstname, date, text, posts.id FROM posts INNER JOIN users ON users.id = posts.user_id"
    );
    posts = postsDb.rows;
    const userDb = await pool.query("SELECT * FROM users WHERE id=$1", [
      req.user.id,
    ]);
    user = userDb.rows[0];
  }
  res.render("index", {
    user,
    posts,
  });
});

// ROUTE DELETE POST
app.post("/posts/:post_id/delete", async (req, res, next) => {
  try {
    await pool.query("DELETE FROM posts WHERE id = $1", [req.params.post_id]);
    return res.redirect("/");
  } catch (err) {
    next(err);
  }
});

// ROUTE SIGN UP
app
  .route("/signup")
  .get((req, res) => {
    if (req.isAuthenticated()) return res.redirect("/secretaccess");
    res.render("signup", {
      message: req.flash("auth_err"),
    });
  })
  .post(signUpValidations, async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const formattedError = {};
      errors.array().forEach((err) => {
        formattedError[err.path] = err.msg;
      });
      return res.render("signup", {
        errors: formattedError,
      });
    }

    try {
      const { firstname, lastname, email, password } = matchedData(req);
      const hashedpassword = await bcrypt.hash(password, 10);

      const { rows } = await pool.query(
        "INSERT INTO users(firstname, lastname, email, password) VALUES($1, $2, $3, $4) RETURNING *",
        [firstname, lastname, email, hashedpassword]
      );
      const user = rows[0];

      req.login(user, (err) => {
        // req.login() and passport.authentificate() populate also req.user like passport.session()
        // It populates req.session with the serializeUser() user id like passport.authentificate() (which call req.login() in intern)
        if (err) {
          return next(err);
        }
        res.redirect("/secretaccess");
      });
    } catch (err) {
      next(err);
    }
    return;
  });

// ROUTE SECRET ACCESSs
app
  .route("/secretaccess")
  .get(isAuth, (req, res) => {
    res.render("secretaccess");
  })
  .post(
    body("code").custom(async (code) => {
      const { rows } = await pool.query("SELECT code FROM secret_access");
      const codeDb = rows[0].code;
      const match = await bcrypt.compare(code, codeDb);
      if (!match) throw new Error("Password doesn't correspond!");
    }),
    async (req, res, next) => {
      const error = validationResult(req);
      if (!error.isEmpty())
        return res.render("secretaccess", { error: error.array() });

      try {
        await pool.query("UPDATE users SET status = TRUE WHERE id=$1", [
          req.user.id,
        ]);

        res.redirect("/");
      } catch (err) {
        next(err);
      }
    }
  );

// ROUTE LOG IN
app
  .route("/signin")
  .get((req, res) => {
    if (req.isAuthenticated()) return res.redirect("/secretaccess");
    res.render("signin");
  })
  .post(
    signInValidations,
    (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const formattedError = {};
        errors.array().forEach((err) => {
          formattedError[err.path] = err.msg;
        });
        return res.render("signin", {
          errors: formattedError,
        });
      }
      next();
    },
    passport.authenticate("local", {
      successRedirect: "/secretaccess",
      failureRedirect: "/signin",
      failureFlash: "Invalid credentials.",
    })
  );

// ROUTE LOG OUT
app.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  if (err) return console.error(err);
  console.log(`Server running on ${PORT}`);
});
