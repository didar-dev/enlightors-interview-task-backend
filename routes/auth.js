const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const { SignUp, SignIn, Me } = require("../controllers/auth");
router.post("/signup", SignUp);
router.post("/signin", SignIn);
router.use(verifyJWT);
router.get("/me", Me);

module.exports = router;
