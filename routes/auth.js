const express = require("express");
const router = express.Router();
const authOnly = require("../middleware/verifyJWT");
const { SignUp, SignIn, Me } = require("../controllers/auth");
router.post("/signup", SignUp);
router.post("/signin", SignIn);
router.use(authOnly);
router.get("/me", Me);

module.exports = router;
