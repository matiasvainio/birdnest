const Pilot = require("./models/pilot");
const {
  getDroneDataFromAPI,
  mapPilotsToDronesInside,
} = require("./libs/dronePilotService");

const OLDEST_MESSAGE_TIME = 60 * 10 * 1000;

const getPilotsFromDatabase = async () => {
  const response = await Pilot.find({
    createdAt: { $gt: new Date(Date.now() - OLDEST_MESSAGE_TIME) },
  });
  return response;
};

const savePilotToDatabase = (data) => {
  data.forEach((item) =>
    new Pilot({
      firstName: item.pilot.firstName,
      lastName: item.pilot.lastName,
      email: item.pilot.email,
      phoneNumber: item.pilot.phoneNumber,
      distance: item.distance,
    }).save()
  );
};

const getDroneAndPilotData = async () => {
  const result = await getDroneDataFromAPI();
  const drones = result.report.capture[0].drone;

  const droneAndPilotInfo = Promise.all(mapPilotsToDronesInside(drones));

  return droneAndPilotInfo;
};

const subscribeToDataChange = async () => {
  const response = await getDroneAndPilotData();
  await new Promise((resolve) => setTimeout(resolve, 2000));

  savePilotToDatabase(response);
  await subscribeToDataChange();
};

subscribeToDataChange();

module.exports = getPilotsFromDatabase;
