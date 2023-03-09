const knex = require("../utils/knex");
const logger = async (action, userId) => {
  await knex("Logs").insert({
    action: action,
    user_id: userId,
  });
};
module.exports = logger;
