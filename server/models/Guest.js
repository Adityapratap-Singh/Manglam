const mongoose = require("mongoose");

const GuestSchema = new mongoose.Schema({
  name: String,
  inviteId: String,
  withFamily: { type: Boolean, default: false },
  opened: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Guest", GuestSchema);
