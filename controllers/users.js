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
const DeleteUser = async (req, res) => {
  if (!req.isAuth) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!req.user.role === "super_admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { id } = req.params;
  const user = await knex("users").where("id", id).del();
  return res.status(200).json({
    message: "User deleted successfully",
    user,
  });
};
const CreateUser = async (req, res) => {
  if (!req.isAuth) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!req.user.role === "super_admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { name, email, password, role, active } = req.body;
  /// if this feilds are empty
  if (!name || !email || !password || !role || !active) {
    return res.status(400).json({
      message: "Please fill all the fields",
    });
  }

  const userExists = await knex("users").where("email", email).first();
  if (userExists) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await knex("users").insert({
    name,
    email,
    password: hashedPassword,
    role,
    active,
  });
  return res.status(200).json({
    message: "User created successfully",
    user,
  });
};

exports.AllUsers = AllUsers;
exports.DeleteUser = DeleteUser;
exports.CreateUser = CreateUser;
