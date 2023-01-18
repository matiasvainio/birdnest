import { SocketContext, socket } from "./context/socket";
import PilotsList from "./components/PilotsList";
import "./App.css";

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <PilotsList />
    </SocketContext.Provider>
  );
}

export default App;
