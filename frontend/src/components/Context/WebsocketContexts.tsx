import { createContext } from "react";
import { io, Socket } from "socket.io-client";

export const WebsocketContext = createContext<Socket | null>(null);
export const WebsocketProvider = WebsocketContext.Provider;
