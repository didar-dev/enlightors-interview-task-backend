const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const { AllUsers } = require("../controllers/users");
router.use(verifyJWT);
router.get("/all", AllUsers);

module.exports = router;
