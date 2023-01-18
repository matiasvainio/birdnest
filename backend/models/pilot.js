const mongoose = require("mongoose");

const PilotSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phoneNumber: String,
  createdAt: { type: Date, expireAfterSeconds: 60 * 10, default: Date.now },
  distance: Number,
});

const Pilot = mongoose.model("Pilot", PilotSchema);
module.exports = Pilot;
