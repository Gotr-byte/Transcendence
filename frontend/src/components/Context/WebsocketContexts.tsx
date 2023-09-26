import { createContext } from 'react';
import { io, Socket } from 'socket.io-client';

const socket = io('http://localhost:4000', {
	query: {
	  userId: 1, 
	}
  });
export const WebsocketContext = createContext<Socket>(socket);
export const WebsocketProvider = WebsocketContext.Provider;