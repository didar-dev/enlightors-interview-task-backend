const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      return res.status(401).json({ message: "Auth failed!" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    /// if token is not valid, it will throw an error
    req.userData = { userId: decodedToken.id };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Auth failed!" });
  }
};
