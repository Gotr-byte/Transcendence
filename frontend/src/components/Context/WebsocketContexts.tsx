import { createContext } from "react";
import { io, Socket } from "socket.io-client";


//TODO user id parameter must be client user
const socket = io(`${import.meta.env.VITE_API_URL}/?userId=11`);
export const WebsocketContext = createContext<Socket>(socket);
export const WebsocketProvider = WebsocketContext.Provider;
