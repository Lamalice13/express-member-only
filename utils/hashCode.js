// const bcrypt = require("bcryptjs");
// const pool = require("../db/pool");

// const hashCode = async (req, res, next) => {
//   try {
//     const hashedPassword = await bcrypt.hash(req.body.code, 10);
//     await pool.query("INSERT INTO secret_access(code) VALUES($1)", [
//       hashedPassword,
//     ]);
//     req.code = hashedPassword;
//     return next();
//   } catch (err) {
//     return next(err);
//   }
// };

// module.exports = hashCode;
