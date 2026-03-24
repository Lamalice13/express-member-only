const { body } = require("express-validator");

const signInValidations = [
  body("email", "Email in incorrect format").trim().isEmail().normalizeEmail(),

  body("password")
    .matches(/[A-Z]/)
    .withMessage("The password needs at least one alpha character")
    .matches(/[0-9]/)
    .withMessage("The password needs at least one numeric character")
    .isLength({ min: 8 })
    // matches() natively checks if the specific character is present at least one time, so we don't need to specify '+' regex modifier
    .matches(/[^A-Za-z0-9]/)
    .withMessage("The password must be at least 8 characters long"),
];

module.exports = signInValidations;
