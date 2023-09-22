// Events to listen to:
// new-channel-message
// new-user-message
// my-channels
// visible-channels
// [16:05]
// Message to user:
// {
//     "content": "First socket communication",
//     "receiverId": 12
// }
// Message to channel:
// {
//     "content": "Testestest",
//     "channelId": 3
// }

import { createContext } from "react";
import { io, Socket } from "socket.io-client";

export const socket = io('http://localhost:4000');
export const WebsocketContext = createContext<Socket>(socket);
export const WebsocketProvider = WebsocketContext.Provider;