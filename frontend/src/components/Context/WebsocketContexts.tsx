import { createContext } from 'react';
import { io, Socket } from 'socket.io-client';

const socket = io(process.env.FRONTEND_URL + '/?userId=11')
export const WebsocketContext = createContext<Socket>(socket);
export const WebsocketProvider = WebsocketContext.Provider;