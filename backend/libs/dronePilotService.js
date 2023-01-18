const xmlParser = require("xml2js");

const CIRCLE_X = 250_000;
const CIRCLE_Y = 250_000;
const RADIUS = 100_000;

const calculateDistance = (x, y) => {
  return Math.sqrt(Math.pow(x - CIRCLE_X, 2) + Math.pow(y - CIRCLE_Y, 2));
};

const getPilotDataFromAPI = async (drone) => {
  const pilotsUrl = `https://assignments.reaktor.com/birdnest/pilots/${drone.serialNumber}`;
  const response = await fetch(pilotsUrl);

  if (response.status !== 200) return null;

  const currentPilot = await response.json();

  const distance = calculateDistance(drone.positionX, drone.positionY);

  return {
    pilot: currentPilot,
    drone,
    distance,
  };
};

const getDroneDataFromAPI = async () => {
  const droneUrl = "https://assignments.reaktor.com/birdnest/drones";
  const response = await fetch(droneUrl);

  const data = await response.text();

  const xml = xmlParser.parseStringPromise(data);
  return xml;
};

const mapDronesAndPilotsWhenInsideCircle = (drones) => {
  return drones
    .map((drone) =>
      calculateDistance(drone.positionX, drone.positionY) <= RADIUS
        ? getPilotDataFromAPI(drone)
        : null
    )
    .filter((drone) => drone);
};

module.exports = {
  getPilotDataFromAPI,
  getDroneDataFromAPI,
  mapDronesAndPilotsWhenInsideCircle,
};
