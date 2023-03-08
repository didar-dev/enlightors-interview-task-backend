const jwt = require("jsonwebtoken");
const knex = require("../utils/knex");

const authOnly = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: "Unauthorized" });
      } else {
        let user;
        try {
          user = await knex("users").where("id", decodedToken.id).first();
        } catch (error) {
          return res.status(401).json({ message: "Unauthorized" });
        }
        req.isAuth = true;
        req.user = user;
        next();
      }
    });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authOnly;
