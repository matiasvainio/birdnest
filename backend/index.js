const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
require("dotenv").config();
const path = require("path");

const Pilot = require("./models/pilot");
const getPilotsFromDatabase = require("./app");

mongoose.connect(process.env.MONGODB_URI);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
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

app.use(express.static(path.join(__dirname, "build")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
