const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const fileUpload = require("../middleware/file-upload");
const {
  articles,
  createArticle,
  editArticle,
  deleteArticle,
} = require("../controllers/article");
router.use(verifyJWT);
router.get("/articles", articles);
router.post("/create", fileUpload.single("image"), createArticle);
router.patch("/edit/:id", fileUpload.single("image"), editArticle);
router.delete("/delete/:id", deleteArticle);
module.exports = router;
