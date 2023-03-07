const knex = require("../utils/knex");

const articles = async (req, res) => {
  const hasTable = await knex.schema.hasTable("articles");
  if (!hasTable) {
    await knex.schema.createTable("articles", (table) => {
      table.increments("id");
      table.string("title");
      table.string("description");
      table.string("image");
    });
  }
  const articles = await knex("articles").select("*");
  return res.status(200).json({
    message: "Articles fetched successfully",
    articles,
  });
};
const createArticle = async (req, res) => {
  const { title, description, image } = req.body;
  const article = await knex("articles").insert({
    title,
    description,
    image,
  });
  return res.status(200).json({
    message: "Article created successfully",
    article,
  });
};

module.exports.createArticle = createArticle;
exports.articles = articles;
