import { createContext } from "react";
import { io, Socket } from "socket.io-client";

const socket = io(`${import.meta.env.VITE_API_URL}/?userId=12`);
export const WebsocketContext = createContext<Socket>(socket);
export const WebsocketProvider = WebsocketContext.Provider;
