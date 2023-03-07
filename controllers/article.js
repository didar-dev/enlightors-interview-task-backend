const knex = require("../utils/knex");
const fs = require("fs");
const articles = async (req, res) => {
  if (!req.isAuth) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const articles = await knex("articles")
    .select("*")
    .orderBy("created_at", "desc");

  return res.status(200).json({
    message: "Articles fetched successfully",
    articles,
  });
};
const createArticle = async (req, res) => {
  if (!req.isAuth) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!req.user.role === "admin" || !req.user.role === "super_admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const formData = req.body;
  try {
    await knex("articles").insert({
      title: formData.title,
      description: formData.description,
      image: req.file
        ? `uploads/images/${formData.title}.` +
          req.file.originalname.split(".")[1]
        : "#",
      user_id: req.user.id,
    });
  } catch (error) {
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        console.log(err);
      });
    }
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
  if (req.file) {
    fs.rename(
      req.file.path,
      `uploads/images/${formData.title}.` + req.file.originalname.split(".")[1],
      (err) => {
        console.log(err);
      }
    );
  }

  return res.status(200).json({
    message: "Article created successfully",
  });
};
const deleteArticle = async (req, res) => {
  if (!req.isAuth) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!req.user.role === "admin" || !req.user.role === "super_admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const article = await knex("articles").where("id", req.params.id).first();
  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }
  if (article.image !== "#") {
    fs.unlink(article.image, (err) => {
      console.log(err);
    });
  }
  await knex("articles").where("id", req.params.id).del();
  return res.status(200).json({ message: "Article deleted successfully" });
};

const editArticle = async (req, res) => {
  if (!req.isAuth) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!req.user.role === "admin" || !req.user.role === "super_admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const formData = req.body;
  const article = await knex("articles").where("id", req.params.id).first();
  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }
  if (req.file) {
    if (article.image !== "#") {
      fs.unlink(article.image, (err) => {
        console.log(err);
      });
    }
    fs.rename(
      req.file.path,
      `uploads/images/${formData.title}.` + req.file.originalname.split(".")[1],
      (err) => {
        console.log(err);
      }
    );
  }
  await knex("articles")
    .where("id", req.params.id)
    .update({
      title: formData.title,
      description: formData.description,
      image: req.file
        ? `uploads/images/${formData.title}.` +
          req.file.originalname.split(".")[1]
        : article.image,
    });
  return res.status(200).json({ message: "Article updated successfully" });
};

exports.editArticle = editArticle;
exports.deleteArticle = deleteArticle;
exports.createArticle = createArticle;
exports.articles = articles;
