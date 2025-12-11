import { Cron, CronExpression } from '@nestjs/schedule';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RoomsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  sendClientCommand(clientId: string, commandData: any) {
    this.server.to(clientId).emit('trigger-function', commandData);
  }

  @SubscribeMessage('join-room')
  async handleChangeRoom(
    @MessageBody() roomName: string,
    @ConnectedSocket() client: Socket,
  ) {
    // The socket joins the specific room
    const currentRooms = client.rooms;
    for (const room in currentRooms) {
      await client.leave(room);
    }
    await client.join(roomName);
    console.log(`Client ${client.id} joined room: ${roomName}`);
    // Optional: Notify others in the room
    client.to(roomName).emit('message', `User ${client.id} has joined!`);
  }

  @SubscribeMessage('leave-all-rooms')
  async handelLeaveAllRooms(@ConnectedSocket() client: Socket) {
    const currentRooms = client.rooms;
    for (const room in currentRooms) {
      await client.leave(room);
    }
    console.log('client', client.id, 'left all rooms');
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  refreshAllRooms() {
    this.server.emit('refresh-room');
  }

  refreshRoom(roomName: string) {
    this.server.to(roomName).emit('refresh-room');
  }
}
