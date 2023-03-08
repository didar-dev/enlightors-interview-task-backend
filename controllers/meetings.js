const knex = require("../utils/knex");
const fs = require("fs");

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
  // we dont care for role admin and superadmin can create mettings
  const { title, date, minutes_of_meeting, next_meeting_date, client_id } =
    req.body;
  const user_id = req.user.id;
  const meeting = await knex("meetings").insert({
    title,
    date,
    minutes_of_meeting,
    next_meeting_date,
    client_id,
    user_id,
  });
  return res.status(200).json({
    message: "Meeting created successfully",
    meeting,
  });
};

exports.meetings = meetings;
exports.createMeeting = createMeeting;
