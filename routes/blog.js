const express = require("express");
const router = express.Router();
const authOnly = require("../middleware/authOnly");

const AdminOnly = require("../middleware/AdminOnly");
const { articles } = require("../controllers/blog");
router.use(authOnly);
router.post("/articles", articles);

module.exports = router;
