const express = require("express");
const router = express.Router();
const authOnly = require("../middleware/authOnly");

const AdminOnly = require("../middleware/AdminOnly");
const { articles, createArticle } = require("../controllers/blog");
router.use(authOnly);
router.post("/articles", articles);
router.use(AdminOnly);
router.get("/create", (req, res) => {
  res.send("Create article");
});
module.exports = router;
