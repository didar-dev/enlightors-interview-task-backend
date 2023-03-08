const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const { AllUsers, DeleteUser } = require("../controllers/users");
router.use(verifyJWT);
router.get("/all", AllUsers);
router.delete("/delete/:id", DeleteUser);

module.exports = router;
