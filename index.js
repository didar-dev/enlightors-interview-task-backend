const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const cors = require("cors");
const knex = require("./utils/knex");
const blog = require("./routes/blog");
const auth = require("./routes/auth");
const cookieParser = require("cookie-parser");
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

knex.raw("SELECT 1+1 AS result").then(() => {
  console.log("Connected to database!");
});

//

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/auth", auth);

app.use("/blog", blog);

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});

////// knex.js
// knex.schema
//   .createTable("users", function (table) {
//     table.increments("id");
//     table.string("name");
//     table.string("email");
//     table.string("password");
//     table.enu("role", ["super_admin", "admin", "user"]).defaultTo("user");
//   })
//   .then(function () {
//     // Create the Articles table
//     return knex.schema.createTable("articles", function (table) {
//       table.increments("id");
//       table.string("image");
//       table.string("title");
//       table.string("description");
//       table.integer("user_id").unsigned().references("id").inTable("users");
//     });
//   })
//   .then(function () {
//     // Create the Clients table
//     return knex.schema.createTable("clients", function (table) {
//       table.increments("id");
//       table.string("name");
//       table.string("contact_number");
//       table.date("joined_date");
//     });
//   })
//   .then(function () {
//     // Create the Meetings table
//     return knex.schema.createTable("meetings", function (table) {
//       table.increments("id");
//       table.integer("user_id").unsigned().references("id").inTable("users");
//       table.integer("client_id").unsigned().references("id").inTable("clients");
//       table.date("date");
//       table.text("minutes_of_meeting");
//       table.date("next_meeting_date");
//     });
//   })
//   .catch(function (error) {
//     console.error(error);
//   })
//   .finally(function () {
//     knex.destroy();
//   });
