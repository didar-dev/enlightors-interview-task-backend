const knex = require("../utils/knex");
const fs = require("fs");
const articles = async (req, res) => {
  if (!req.isAuth) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const articles = await knex("articles").select("*");
  return res.status(200).json({
    message: "Articles fetched successfully",
    articles,
  });
};
const createArticle = async (req, res) => {
  const formData = req.body;
  try {
    await knex("articles").insert({
      title: formData.title,
      description: formData.description,
      image:
        `uploads/images/${formData.title}.` +
        req.file.originalname.split(".")[1],
      user_id: req.user.id,
    });
  } catch (error) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
  fs.rename(
    req.file.path,
    `uploads/images/${formData.title}.` + req.file.originalname.split(".")[1],
    (err) => {
      console.log(err);
    }
  );

  return res.status(200).json({
    message: "Article created successfully",
  });
};

module.exports.createArticle = createArticle;
exports.articles = articles;
