const PilotInfo = ({ pilot }) => {
  return (
    <div>
      <h2>
        {pilot.firstName} {pilot.lastName}
      </h2>
      <p>
        Email: {pilot.email} Phone number: {pilot.phoneNumber}
      </p>
      <p>Distance: {(pilot.distance / 1000).toFixed(2)} m</p>
      <p>Last seen: {new Date(pilot.createdAt).toLocaleString()}</p>
    </div>
  );
};

export default PilotInfo;
