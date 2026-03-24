const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://postgres:aqpm@localhost:5432/club_house",
});

module.exports = pool;
