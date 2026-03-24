const express = require("express");
const path = require("node:path");
const app = express();
const formValidations = require("./middlewares/formValidation");
const { validationResult, matchedData } = require("express-validator");
const pool = require("./db/pool");

// CONFIG
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// ROUTES
app
  .route("/signup")
  .get((req, res) => {
    res.render("signup");
  })
  .post(formValidations, async (req, res, next) => {
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
      await pool.query(
        "INSERT INTO users(firstname, lastname, email, password) VALUES($1, $2, $3, $4)",
        [firstname, lastname, email, hashedpassword]
      );
      res.redirect("/secret-access");
    } catch (err) {
      next(err);
    }
    return;
  });

// PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  if (err) return console.error(err);
  console.log(`Server running on ${PORT}`);
});
