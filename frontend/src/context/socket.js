import { createContext } from "react";
import io from "socket.io-client";

export const socket = io.connect("cool-snow-4493.fly.dev");
// export const socket = io.connect("localhost:3000");
export const SocketContext = createContext();
