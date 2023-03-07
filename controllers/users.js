const knex = require("../utils/knex");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const AllUsers = async (req, res) => {
  if (!req.isAuth) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!req.user.role === "super_admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const users = await knex("users").select(
    "id",
    "name",
    "email",
    "role",
    "active",
    "created_at",
    "updated_at"
  );
  return res.status(200).json({
    message: "Users fetched successfully",
    users,
  });
};
exports.AllUsers = AllUsers;
