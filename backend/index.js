const { createServer } = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
require("dotenv").config();

const Pilot = require("./models/pilot");
const getPilotsFromDatabase = require("./app");

mongoose.connect(process.env.MONGODB_URI);

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3001",
  },
});

io.on("connection", async (socket) => {
  socket.on("user/connected", async () => {
    console.log("connect");
    const pilots = await getPilotsFromDatabase();
    socket.emit("data/pilots", pilots);
  });

  Pilot.watch().on("change", async () => {
    const pilots = await getPilotsFromDatabase();
    socket.emit("data/pilots", pilots);
  });
});

io.listen(3000);
