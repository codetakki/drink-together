import { Module } from '@nestjs/common';
import { RoomController } from './controller/room.controller';
import { UserEntity } from 'src/user/user.entity';
import { DrinkEntity } from 'src/drink/drink.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from './entity/room.entity';

@Module({
  controllers: [RoomController],
  providers: [],
  imports: [TypeOrmModule.forFeature([UserEntity, DrinkEntity, RoomEntity])],
})
export class RoomModule {}
