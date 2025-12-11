// websocket.module.ts
import { Module } from '@nestjs/common';
import { RoomsGateway } from './rooms.gateway';

@Module({
  // Register the Gateway ONCE here as a provider
  providers: [RoomsGateway],
  // Make the Gateway injectable in any module that imports this one
  exports: [RoomsGateway],
})
export class WebSocketModule {}
