import { Module } from '@nestjs/common';
import { RoomController } from './controller/room.controller';
import { UserEntity } from 'src/user/user.entity';
import { DrinkEntity } from 'src/drink/drink.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from './entity/room.entity';
import { WebSocketModule } from 'src/websocket/websocket.module';

@Module({
  controllers: [RoomController],
  providers: [],
  imports: [
    TypeOrmModule.forFeature([UserEntity, DrinkEntity, RoomEntity]),
    WebSocketModule,
  ],
})
export class RoomModule {}
