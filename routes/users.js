const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const { CreateUser, AllUsers, DeleteUser } = require("../controllers/users");
router.use(verifyJWT);
router.get("/all", AllUsers);
router.post("/create", CreateUser);
router.delete("/delete/:id", DeleteUser);

module.exports = router;
