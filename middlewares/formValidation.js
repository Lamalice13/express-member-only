const { body, validationResult, matchedData } = require("express-validator");
const bcrypt = require("bcryptjs");

const formValidations = [
  body("firstname", "First name in incorrect format")
    .trim()
    .isAlpha()
    .isLength({ min: 1, max: 10 }),

  body("lastname", "Last name in incorrect format")
    .trim()
    .isAlpha()
    .isLength({ min: 1, max: 10 }),

  body("email", "Email in incorrect format").trim().isEmail().normalizeEmail(),

  body("status").isIn(["sub", "none"]),

  body("password")
    .matches(/[A-Z]/)
    .withMessage("The password needs at least one alpha character")
    .matches(/[0-9]/)
    .withMessage("The password needs at least one numeric character")
    .isLength({ min: 8 })
    // matches() natively checks if the specific character is present at least one time, so we don't need to specify '+' regex modifier
    .matches(/[^A-Za-z0-9]/)
    .withMessage("The password must be at least 8 characters long"),
  body("confirm_password").custom(async (password, { req }) => {
    if (req.confirm_password !== password) {
      throw new Error("Passwords don't correspond!");
    }
    return true;
  }),
];
