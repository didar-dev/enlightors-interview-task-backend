require("dotenv").config();

const knex = require("knex")({
  client: "mysql2",
  connection: {
    host: process.env.KNEX_host,
    port: process.env.KNEX_port,
    user: process.env.KNEX_user,
    password: process.env.KNEX_password,
    database: process.env.KNEX_database,
  },
});

module.exports = knex;
