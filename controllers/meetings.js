const knex = require("../utils/knex");
const fs = require("fs");
const logger = require("../utils/Logger");
const meetings = async (req, res) => {
  if (!req.isAuth) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const role = req.user.role;
  const user_id = req.user.id;
  let meetings;
  if (role === "super_admin") {
    meetings = await knex("meetings")
      .select(
        "meetings.id",
        "meetings.date",
        "meetings.title",
        "meetings.minutes_of_meeting",
        "meetings.next_meeting_date",
        "meetings.created_at",
        "meetings.updated_at",
        "meetings.client_id",
        "meetings.user_id",
        "clients.name as client",
        "users.name as user"
      )
      .leftJoin("clients", "meetings.client_id", "clients.id")
      .leftJoin("users", "meetings.user_id", "users.id")
      .orderBy("meetings.date", "desc");
  } else if (role === "admin") {
    meetings = await knex("meetings")
      .select(
        "meetings.id",
        "meetings.date",
        "meetings.title",
        "meetings.minutes_of_meeting",
        "meetings.next_meeting_date",
        "meetings.created_at",
        "meetings.updated_at",
        "meetings.client_id",
        "meetings.user_id",
        "clients.name as client",
        "users.name as user"
      )
      .leftJoin("clients", "meetings.client_id", "clients.id")
      .leftJoin("users", "meetings.user_id", "users.id")
      .where("meetings.user_id", user_id)
      .orderBy("meetings.date", "desc");
  }
  return res.status(200).json({
    message: "Meetings fetched successfully",
    meetings,
  });
};
const createMeeting = async (req, res) => {
  if (!req.isAuth) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { title, date, minutes_of_meeting, next_meeting_date, client_id } =
    req.body;
  if (!title || !date || !minutes_of_meeting || !client_id) {
    return res.status(400).json({
      message: "Please fill all the fields",
    });
  }

  const user_id = req.user.id;
  const meeting = await knex("meetings").insert({
    title,
    date,
    minutes_of_meeting,
    next_meeting_date,
    client_id,
    user_id,
  });
  await logger(`Created a meeting with title ${title}`, user_id);
  return res.status(200).json({
    message: "Meeting created successfully",
    meeting,
  });
};
const deleteMeeting = async (req, res) => {
  if (!req.isAuth) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { id } = req.params;
  /// if user is admin check if the metting with him as user
  const role = req.user.role;
  const user_id = req.user.id;

  if (role === "admin") {
    const meeting = await knex("meetings")
      .select("meetings.id")
      .where("meetings.id", id)
      .where("meetings.user_id", user_id);
    if (!meeting.length) {
      return res.status(400).json({
        message: "You are not authorized to delete this meeting",
      });
    }
  }
  const mettingtitle = await knex("meetings")
    .select("title")
    .where("id", id)
    .first();
  const meeting = await knex("meetings").where("id", id).del();
  await logger(`Deleted a meeting with title ${mettingtitle.title}`, user_id);
  return res.status(200).json({
    message: "Meeting deleted successfully",
    meeting,
  });
};
const editMeeting = async (req, res) => {
  if (!req.isAuth) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { id } = req.params;
  const { title, date, minutes_of_meeting, next_meeting_date, client_id } =
    req.body;
  if (!title || !date || !minutes_of_meeting || !client_id) {
    return res.status(400).json({
      message: "Please fill all the fields",
    });
  }

  let meeting = await knex("meetings").where("id", id).first();

  if (!meeting) {
    return res.status(400).json({
      message: "Meeting not found",
    });
  }
  await knex("meetings").where("id", id).update({
    title,
    date,
    minutes_of_meeting,
    next_meeting_date,
    client_id,
  });

  await logger(`Edited a meeting with title ${title}`, req.user.id);
  return res.status(200).json({
    message: "Meeting updated successfully",
    meeting,
  });
};

exports.meetings = meetings;
exports.createMeeting = createMeeting;
exports.deleteMeeting = deleteMeeting;
exports.editMeeting = editMeeting;
