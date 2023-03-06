const express = require("express");
const router = express.Router();
const authOnly = require("../middleware/authOnly");

router.use(authOnly);
router.post("/blog", (req, res) => {
  res.send("Blog created!");
});

module.exports = router;
