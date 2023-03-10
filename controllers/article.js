const knex = require("../utils/knex");
const fs = require("fs");
const { encode } = require("blurhash");
const sharp = require("sharp");
const logger = require("../utils/Logger");

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
  if (req.user.role === "user") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  let blurhash = "";
  if (req.file) {
    await encodeImageToBlurhash(req.file.path).then((hash) => {
      blurhash = hash;
    });
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
      image_blurhash: blurhash,
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
  await logger(`Created article ${formData.title}`, req.user.id);
  return res.status(200).json({
    message: "Article created successfully",
  });
};
const deleteArticle = async (req, res) => {
  if (!req.isAuth) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (req.user.role === "user") {
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
  await logger(`Deleted article ${article.title}`, req.user.id);
  return res.status(200).json({ message: "Article deleted successfully" });
};

const editArticle = async (req, res) => {
  if (!req.isAuth) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (req.user.role === "user") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const formData = req.body;
  const article = await knex("articles").where("id", req.params.id).first();
  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }
  let blurhash = "";
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
    await encodeImageToBlurhash(req.file.path).then((hash) => {
      blurhash = hash;
    });
  } else {
    blurhash = article.image_blurhash;
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
      image_blurhash: req.file ? blurhash : article.image_blurhash,
    });
  await logger(`Edited article ${article.title}`, req.user.id);
  return res.status(200).json({ message: "Article updated successfully" });
};

exports.editArticle = editArticle;
exports.deleteArticle = deleteArticle;
exports.createArticle = createArticle;
exports.articles = articles;
const encodeImageToBlurhash = (path) =>
  new Promise((resolve, reject) => {
    sharp(path)
      .raw()
      .ensureAlpha()
      .resize(64, 64, { fit: "inside" })
      .toBuffer((err, buffer, { width, height }) => {
        if (err) return reject(err);
        resolve(encode(new Uint8ClampedArray(buffer), width, height, 4, 4));
      });
  });
