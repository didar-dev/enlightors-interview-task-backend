const knex = require("../utils/knex");
const bcrypt = require("bcryptjs");
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
  
};

exports.SignUp = SignUp;
