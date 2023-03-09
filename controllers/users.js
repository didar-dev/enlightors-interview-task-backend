const knex = require("../utils/knex");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const logger = require("../utils/Logger");
const AllUsers = async (req, res) => {
  if (!req.isAuth) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!req.user.role === "super_admin" || !req.user.role === "admin") {
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
  if (!req.user.role === "super_admin" || !req.user.role === "admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const userExists = await knex("users").where("id", req.params.id).first();

  const UserRole = userExists.role;
  /// admin cant delete admin or super admin
  if (
    req.user.role === "admin" &&
    (UserRole === "admin" || UserRole === "super_admin")
  ) {
    return res.status(400).json({
      message: "You are not allowed to do this",
    });
  }
  const { id } = req.params;
  let user = await knex("users").where("id", id).first();
  if (!user) {
    return res.status(400).json({
      message: "User not found",
    });
  }
  await knex("users").where("id", id).del();
  await logger(`Deleted user ${user.name}`, req.user.id);
  return res.status(200).json({
    message: "User deleted successfully",
    user,
  });
};
const CreateUser = async (req, res) => {
  if (!req.isAuth) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!req.user.role === "super_admin" || !req.user.role === "admin") {
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
  await logger(`Created user ${name}`, req.user.id);
  return res.status(200).json({
    message: "User created successfully",
    user,
  });
};
const EditUser = async (req, res) => {
  if (!req.isAuth) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!req.user.role === "super_admin" || !req.user.role === "admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.params;
  const { name, email, password, role, active } = req.body;
  if (!name || !email || !role || !active) {
    return res.status(400).json({
      message: "Please fill all the fields",
    });
  }
  const userExists = await knex("users").where("email", email).first();
  if (!userExists) {
    return res.status(400).json({
      message: "User does not exists",
    });
  }

  let userUpdate = { name, email, role, active };
  if (password) {
    const isMatch = await bcrypt.compare(password, userExists.password);
    if (!isMatch) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      userUpdate.password = hashedPassword;
    }
  }
  let user = await knex("users").where("id", id).first();
  await knex("users").where("id", id).update(userUpdate);
  await logger(`Edited user ${user.name} id: ${user.id}`, req.user.id);
  return res.status(200).json({
    message: "User updated successfully",
    user,
  });
};

exports.AllUsers = AllUsers;
exports.DeleteUser = DeleteUser;
exports.CreateUser = CreateUser;
exports.EditUser = EditUser;
