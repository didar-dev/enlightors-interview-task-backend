const express = require("express");
const app = express();
const knex = require("./utils/knex");
app.get("/", (req, res) => {
  res.send("Hello World!");
});

knex.raw("SELECT 1+1 AS result").then(() => {
  console.log("Connected to database!");
});
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
