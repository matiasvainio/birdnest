import React, { useState, useEffect, useContext, useCallback } from "react";
import { SocketContext } from "../context/socket";
import PilotInfo from "./PilotInfo";

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
    <div className="pilots-list">
      <h1>List of the nosy pilots</h1>
      <p>
        This is a list of drone pilots that have been interested in the
        endangered Monadikuikka and have been flying too close to it's nest.
      </p>
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
