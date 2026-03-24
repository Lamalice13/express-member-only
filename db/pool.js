const Pool = require("pg");

const pool = new Pool({
  connectionString: "postgresql://postgres:aqpm@localhost:5432/members",
});

module.exports = pool;
