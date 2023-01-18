import { createContext } from "react";
import io from "socket.io-client";

export const socket = io.connect("long-grass-5744.fly.dev");
export const SocketContext = createContext();
