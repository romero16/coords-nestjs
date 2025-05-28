import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class CoordsGateway {
  @WebSocketServer()
  server: Server;

 
  emitCoordsCreate(data: any) {
    this.server.emit('newCoords', data);
  }
}