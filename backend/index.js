const express = require("express");
const { createServer } = require("http");
const xmlParser = require("xml2js");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const port = 3000;

const CIRCLE_X = 250_000;
const CIRCLE_Y = 250_000;
const CIRCLE_RADIUS = 100_000;

const PilotSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phoneNumber: String,
  createdAt: { type: Date, expires: 30, default: Date.now },
  distance: Number,
});
const Pilot = mongoose.model("Pilot", PilotSchema);

const isInside = (x, y) => {
  if (
    (x - CIRCLE_X) * (x - CIRCLE_X) + (y - CIRCLE_Y) * (y - CIRCLE_Y) <=
    CIRCLE_RADIUS * CIRCLE_RADIUS
  )
    return true;
  else return false;
};

const calculateDistance = (x, y) => {
  return Math.sqrt(Math.pow(x - CIRCLE_X, 2) + Math.pow(y - CIRCLE_Y, 2));
};

const getPilotInformation = async (drone) => {
  const pilotsUrl = `https://assignments.reaktor.com/birdnest/pilots/${drone.serialNumber}`;
  const response = await fetch(pilotsUrl);

  const currentPilot = await response.json();
  const distance = calculateDistance(drone.positionX, drone.positionY);

  const newPilot = new Pilot({
    firstName: currentPilot.firstName,
    lastName: currentPilot.lastName,
    email: currentPilot.email,
    phoneNumber: currentPilot.phoneNumber,
    distance: distance,
  });

  await newPilot.save();

  return {
    pilot: currentPilot,
    drone,
    distance,
  };
};

const checkIfDroneInsideArea = (drones) => {
  return drones.map((drone) =>
    isInside(drone.positionX, drone.positionY)
      ? getPilotInformation(drone)
      : null
  );
};

const getDroneInformation = async () => {
  const droneUrl = "https://assignments.reaktor.com/birdnest/drones";
  const response = await fetch(droneUrl);

  const data = await response.text();

  const xml = xmlParser.parseStringPromise(data);
  return xml;
};

const getData = async () => {
  const result = await getDroneInformation();
  const drones = result.report.capture[0].drone;

  const droneAndPilotInfo = Promise.all(checkIfDroneInsideArea(drones));

  return droneAndPilotInfo;
};

const subscribe = async () => {
  const response = await getData();

  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log(response);
  await subscribe();
};

subscribe();

mongoose.connect(process.env.MONGODB_URI);

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3001",
  },
});

const getPilots = async () => {
  const response = await Pilot.find({
    createdAt: { $lt: new Date(Date.now() - 30) },
  });
  return response;
};

io.on("connection", async (socket) => {
  socket.on("user/connected", async () => {
    console.log("connect");
    const pilots = await getPilots();
    socket.emit("data/pilots", pilots);
  });

  Pilot.watch().on("change", async () => {
    const pilots = await getPilots();
    socket.emit("data/pilots", pilots);
  });
});

io.listen(3000);
