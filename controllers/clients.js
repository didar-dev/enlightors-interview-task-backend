const knex = require("../utils/knex");
const bcrypt = require("bcryptjs");

const AllClients = async (req, res) => {
  if (!req.isAuth) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!req.user.role === "super_admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const clients = await knex("clients")
    .select(
      "clients.id",
      "clients.name",
      "clients.contact_number",
      "clients.joined_date",
      "clients.created_at",
      "clients.updated_at"
    )
    .leftJoin("meetings", "clients.id", "meetings.client_id")
    .groupBy("clients.id")
    .count("meetings.id as meetings_count");
  return res.status(200).json({
    message: "Clients fetched successfully",
    clients,
  });
};
const DeleteClient = async (req, res) => {
  if (!req.isAuth) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!req.user.role === "super_admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { id } = req.params;
  /// check if client has any meetings
  const clientMeetings = await knex("meetings").where("client_id", id).first();
  if (clientMeetings) {
    return res.status(400).json({
      message: "Client has meetings, cannot delete",
    });
  }
  const client = await knex("clients").where("id", id).del();
  return res.status(200).json({
    message: "Client deleted successfully",
    client,
  });
};
const CreateClient = async (req, res) => {
  if (!req.isAuth) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!req.user.role === "super_admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { name, contact_number, joined_date } = req.body;
  if (!name || !contact_number) {
    return res.status(400).json({
      message: "Please fill all the fields",
    });
  }

  const clientExists = await knex("clients")
    .where("contact_number", contact_number)
    .first();
  if (clientExists) {
    return res.status(400).json({
      message: "Client already exists",
    });
  }
  const client = await knex("clients").insert({
    name,
    contact_number,
    joined_date: joined_date || new Date(),
  });
  return res.status(200).json({
    message: "Client created successfully",
    client,
  });
};

exports.AllClients = AllClients;
exports.DeleteClient = DeleteClient;
exports.CreateClient = CreateClient;
