const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const { meetings } = require("../controllers/meetings");
router.use(verifyJWT);
router.get("/", meetings);
module.exports = router;
