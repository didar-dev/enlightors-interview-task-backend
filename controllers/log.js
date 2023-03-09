const knex = require("../utils/knex");

const GetLogs = async (req, res) => {
  if (!req.isAuth) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!req.user.role === "super_admin" || !req.user.role === "admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const logs = await knex("Logs")
    .select(
      "Logs.id",
      "Logs.action",
      "Logs.created_at",
      "Logs.updated_at",
      "users.name as user_name"
    )
    .leftJoin("users", "Logs.user_id", "users.id")
    .orderBy("Logs.created_at", "desc");
  return res.status(200).json({
    message: "Logs fetched successfully",
    logs,
  });
};

module.exports = {
  GetLogs,
};
