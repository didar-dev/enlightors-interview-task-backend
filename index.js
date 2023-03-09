const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const cors = require("cors");
const knex = require("./utils/knex");
const article = require("./routes/article");
const auth = require("./routes/auth");
const users = require("./routes/users");
const clients = require("./routes/clients");
const mettings = require("./routes/meetings");
const cookieParser = require("cookie-parser");
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/auth", auth);
app.use("/users", users);
app.use("/article", article);
app.use("/clients", clients);
app.use("/meetings", mettings);

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

// knex.schema
//   .createTable("users", function (table) {
//     table.increments("id");
//     table.string("name");
//     table.string("email");
//     table.string("password");
//     table.string("active").defaultTo("false");
//     table.enu("role", ["super_admin", "admin", "user"]).defaultTo("user");
//     table.timestamps(true, true);
//   })
//   .then(function () {
//     // Create the Articles table
//     return knex.schema.createTable("articles", function (table) {
//       table.increments("id");
//       table.string("image");
//       table.string("image_blurhash");
//       table.string("title");
//       table.string("description");
//       table.integer("user_id").unsigned().references("id").inTable("users");
//       table.timestamps(true, true);
//     });
//   })
//   .then(function () {
//     // Create the Clients table
//     return knex.schema.createTable("clients", function (table) {
//       table.increments("id");
//       table.string("name");
//       table.string("contact_number");
//       table.date("joined_date");
//       table.timestamps(true, true);
//     });
//   })
//   .then(function () {
//     // Create the Meetings table
//     return knex.schema.createTable("meetings", function (table) {
//       table.increments("id");
//       table.text("title").notNullable();
//       table.integer("user_id").unsigned().references("id").inTable("users");
//       table.integer("client_id").unsigned().references("id").inTable("clients");
//       table.date("date");
//       table.text("minutes_of_meeting");
//       table.date("next_meeting_date");
//       table.timestamps(true, true);
//     });
//   })
//   .then(function () {
//     return knex.schema.createTable("Logs", function (table) {
//       table.increments("id");
//       table.integer("user_id").unsigned().references("id").inTable("users");
//       table.text("action");
//       table.timestamps(true, true);
//     });
//   })
//   .catch(function (error) {
//     console.error("Error creating tables: ", error);
//   })
//   .finally(function () {
//     knex.destroy();
//   });
