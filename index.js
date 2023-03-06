const express = require("express");
const app = express();
const knex = require("./utils/knex");
const auth = require("./routes/auth");
app.get("/", (req, res) => {
  res.send("Hello World!");
});

knex.raw("SELECT 1+1 AS result").then(() => {
  console.log("Connected to database!");
});
app.use(express.json());
app.use("/auth", auth);
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
