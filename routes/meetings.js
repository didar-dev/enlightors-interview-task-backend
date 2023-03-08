const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const { meetings, createMeeting } = require("../controllers/meetings");
router.use(verifyJWT);
router.get("/", meetings);
router.post("/", createMeeting);

module.exports = router;
