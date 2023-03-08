const knex = require("../utils/knex");
const fs = require("fs");

const meetings = async (req, res) => {
  if (!req.isAuth) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  /// based onthe req.user.role
  /// admin can only see his meetings
  /// super admin can see all meetings
  const role = req.user.role;
  const user_id = req.user.id;
  let meetings;
  if (role === "super_admin") {
    meetings = await knex("meetings")
      .select(
        "meetings.id",
        "meetings.date",
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

exports.meetings = meetings;
