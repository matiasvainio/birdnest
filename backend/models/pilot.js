const mongoose = require("mongoose");

const PilotSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phoneNumber: String,
  createdAt: { type: Date, expires: 650_000, default: Date.now },
  distance: Number,
});

const Pilot = mongoose.model("Pilot", PilotSchema);
module.exports = Pilot;
