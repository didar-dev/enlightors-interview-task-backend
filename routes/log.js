const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const { GetLogs } = require("../controllers/log");

router.use(verifyJWT);
router.get("/", GetLogs);

module.exports = router;
