const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const {
  meetings,
  createMeeting,
  editMeeting,
  deleteMeeting,
} = require("../controllers/meetings");
router.use(verifyJWT);
router.get("/", meetings);
router.post("/", createMeeting);
router.patch("/:id", editMeeting);
router.delete("/:id", deleteMeeting);

module.exports = router;
