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

exports.articles = articles;
