const express = require("express");
const path = require("node:path");
const app = express();
const formValidations = require("./middlewares/formValidation");
const { validationResult, matchedData } = require("express-validator");

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
  .post(formValidations, async (req, res) => {
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
    const data = matchedData(req);

    return;
  });

// PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  if (err) return console.error(err);
  console.log(`Server running on ${PORT}`);
});
