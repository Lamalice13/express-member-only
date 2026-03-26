const pool = require("../db/pool");

// POSTS TABLE
exports.deletePostById = async (id) => {
  await pool.query("DELETE FROM posts WHERE id=$1", [id]);
};

// USERS TABLE
exports.getUserByEmail = async (email) => {
  const { rows } = await pool.query("SELECT * FROM users WHERE email=$1", [
    email,
  ]);
  return rows[0];
};

exports.getUserById = async (id) => {
  const { rows } = await pool.query("SELECT * FROM users WHERE id=$1", [id]);
  return rows[0];
};

exports.setUserStatusTrue = async (id) => {
  await pool.query("UPDATE users SET status = TRUE WHERE id=$1", [id]);
};

exports.InsertUserAndReturn = async (
  firstname,
  lastname,
  email,
  hashedpassword
) => {
  const { rows } = await pool.query(
    "INSERT INTO users(firstname, lastname, email, password) VALUES($1, $2, $3, $4)",
    [firstname, lastname, email, hashedpassword]
  );
  return rows[0];
};

exports.getUserStatus = async (id) => {
  const { rows } = await pool.query("SELECT status FROM users WHERE id=$1", [
    id,
  ]);
  return rows[0].status;
};

// USERS JOIN POSTS TABLE

exports.selectPostsUsers = async () => {
  const { rows } = await pool.query(
    "SELECT firstname, date, text, posts.id FROM posts INNER JOIN users ON users.id = posts.user_id"
  );
  return rows;
};
