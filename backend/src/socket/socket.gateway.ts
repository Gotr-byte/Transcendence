import { MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";

@WebSocketGateway({
    // cors: {
    //     origin: process.env.FRONTEND_URL,
    //     methods: 'GET, POST, PATCH, DELETE',
    //     credentials: true,
    // }
}) 

export class SocketGateway {

  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() body: any) {
    console.log(body);
  }
}