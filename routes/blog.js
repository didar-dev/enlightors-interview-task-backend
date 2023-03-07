const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const fileUpload = require("../middleware/file-upload");
const {
  articles,
  createArticle,
  deleteArticle,
} = require("../controllers/blog");
router.use(verifyJWT);
router.get("/articles", articles);
router.post("/create", fileUpload.single("image"), createArticle);
router.delete("/article/delete/:id", deleteArticle);
module.exports = router;
