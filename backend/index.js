const express = require("express");
const xmlParser = require("xml2js");
const app = express();
const port = 3000;

const CIRCLE_X = 250_000;
const CIRCLE_Y = 250_000;
const CIRCLE_RADIUS = 100_000;

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

const retrievePilotInformation = async (drone) => {
  const pilotsUrl = `https://assignments.reaktor.com/birdnest/pilots/${drone.serialNumber}`;

  const response = await fetch(pilotsUrl);

  const pilot = await response.json();

  return {
    pilot: pilot,
    drone: drone,
    distance: calculateDistance(drone.positionX, drone.position),
  };
};

const checkIfDroneInsideArea = (drones) => {
  return drones.map((drone) =>
    drone.isInside ? retrievePilotInformation() : null
  );
};

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
