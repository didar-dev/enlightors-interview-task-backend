const express = require("express");
const app = express();
const cors = require("cors");
const knex = require("./utils/knex");
const blog = require("./routes/blog");
const auth = require("./routes/auth");
const cookieParser = require("cookie-parser");
knex.raw("SELECT 1+1 AS result").then(() => {
  console.log("Connected to database!");
});
// Middleware
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/auth", auth);
app.use("/blog", blog);
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
