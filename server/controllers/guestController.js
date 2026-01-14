const { v4: uuidv4 } = require("uuid");
const Guest = require("../models/Guest");
const path = require("path");

const createGuest = async (req, res) => {
  const { name, withFamily } = req.body;

  if (!name) return res.status(400).json({ error: "Name required" });

  const inviteId = uuidv4().slice(0, 8);

  const guest = await Guest.create({
    name,
    inviteId,
    withFamily
  });

  res.json(guest);
};

const getAllGuests = async (req, res) => {
  const guests = await Guest.find().sort({ createdAt: -1 });
  res.json(guests);
};

const deleteGuest = async (req, res) => {
  await Guest.findByIdAndDelete(req.params.id);
  res.sendStatus(200);
};

const editGuest = async (req, res) => {
  const { name, withFamily } = req.body;

  if (!name) return res.status(400).json({ error: "Name required" });

  const guest = await Guest.findByIdAndUpdate(
    req.params.id,
    { name, withFamily },
    { new: true }
  );

  if (!guest) return res.status(404).json({ error: "Guest not found" });

  res.json(guest);
};

const getInvitePage = async (req, res) => {
  const guest = await Guest.findOne({ inviteId: req.params.inviteId });

  if (!guest) {
    return res.send("<h2>Invalid Invitation Link</h2>");
  }

  guest.opened = true;
  await guest.save();

  res.sendFile(path.join(__dirname, "..", "views", "invite.html"));
};

const getGuestData = async (req, res) => {
  const guest = await Guest.findOne({ inviteId: req.params.inviteId });
  if (!guest) return res.json({});

  res.json({
    name: guest.name,
    withFamily: guest.withFamily
  });
};

module.exports = {
  createGuest,
  getAllGuests,
  deleteGuest,
  editGuest,
  getInvitePage,
  getGuestData
};
