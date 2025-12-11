import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DrinkEntity } from 'src/drink/drink.entity';
import { RoomEntity } from 'src/room/entity/room.entity';
import { WebSocketModule } from 'src/websocket/websocket.module';

@Module({
  controllers: [UserController],
  providers: [],
  imports: [
    TypeOrmModule.forFeature([UserEntity, DrinkEntity, RoomEntity]),
    WebSocketModule,
  ],
})
export class UserModule {}
