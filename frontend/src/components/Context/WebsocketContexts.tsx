import { createContext } from 'react';
import { io, Socket } from 'socket.io-client';

const socket = io('http://localhost:4000?userID=1', {
	autoConnect: true,
	withCredentials: true
  });
export const WebsocketContext = createContext<Socket>(socket);
export const WebsocketProvider = WebsocketContext.Provider;