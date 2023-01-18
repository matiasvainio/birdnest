import React, { useState, useEffect, useContext, useCallback } from "react";
import { SocketContext } from "../context/socket";

export const PilotsList = () => {
  const [pilots, setPilots] = useState([]);

  const socket = useContext(SocketContext);

  const handlePilots = useCallback((payload) => {
    setPilots(payload.reverse());
  }, []);

  useEffect(() => {
    socket.emit("user/connected");
  }, [socket]);

  useEffect(() => {
    socket.on("data/pilots", (payload) => handlePilots(payload));

    return () => {
      socket.off("data/pilots");
    };
  });

  return (
    <div className="App">
      <ul>
        {pilots.map((pilot) => (
          <li key={pilot._id}>
            <PilotInfo pilot={pilot} />{" "}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PilotsList;

const PilotInfo = ({ pilot }) => {
  return (
    <div>
      <h2>
        {pilot.firstName} {pilot.lastName}
      </h2>
      <p>
        {pilot.email} {pilot.phoneNumber}
      </p>
      <p>{Math.round(pilot.distance / 1000)} m</p>
      <p>{pilot.createdAt}</p>
    </div>
  );
};
