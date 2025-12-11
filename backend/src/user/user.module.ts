import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DrinkEntity } from 'src/drink/drink.entity';
import { RoomEntity } from 'src/room/entity/room.entity';

@Module({
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([UserEntity, DrinkEntity, RoomEntity])],
})
export class UserModule {}
