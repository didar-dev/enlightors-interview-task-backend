const knex = require("../utils/knex");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SignUp = async (req, res) => {
  const { email, name, password } = req.body;
  const user = await knex("users").where({ email }).first();
  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }
  let salt = await bcrypt.genSalt(10);
  let hashedPassword = await bcrypt.hash(password, salt);
  const newUser = await knex("users").insert({
    email,
    name,
    password: hashedPassword,
  });
  return res
    .status(200)
    .json({ message: "User created successfully", newUser });
};
const SignIn = async (req, res) => {
  const { email, password } = req.body;
  /// get user from database
  const user = await knex("users").where({ email }).first();
  if (!user) {
    return res.status(400).json({ message: "User does not exist" });
  }
  // compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  // generate token that expires in 1 day
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: 86400,
  });
  return res.status(200).json({
    message: "User logged in successfully",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },

    token,
  });
};
const Me = async (req, res) => {
  const user = await knex("users").where({ id: req.user.id }).first();
  return res.status(200).json({
    message: "User fetched successfully",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};
exports.SignUp = SignUp;
exports.SignIn = SignIn;
exports.Me = Me;
