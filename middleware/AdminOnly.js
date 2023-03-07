const jwt = require("jsonwebtoken");

const AdminOnly = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (decodedToken.role === "admin") {
        req.isAuth = true;
        req.user = decodedToken;
        next();
      } else {
        res.status(401).json({ message: "Admin only" });
      }
    });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = AdminOnly;
