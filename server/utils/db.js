const Pool = require("pg").Pool;

require("dotenv").config();
const pool = new Pool({
  user: process.env.DBUSER,
  host: process.env.DBHOST,
  database: process.env.DBDATABASE,
  password: process.env.DBPASSWORD,
  port: process.env.DBPORT,
});

module.exports = pool;
