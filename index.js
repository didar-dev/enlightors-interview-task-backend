const express = require("express");
const app = express();
const knex = require("knex")({
  client: "mysql2",
  connection: {
    host: "containers-us-west-16.railway.app",
    port: 7007,
    user: "root",
    password: "Hy3wj0wXFBtkiiulXlR2",
    database: "railway",
  },
});
app.get("/", (req, res) => {
  res.send("Hello World!");
});

knex.raw("SELECT 1+1 AS result").then(() => {
  console.log("Connected to database!");
});
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
