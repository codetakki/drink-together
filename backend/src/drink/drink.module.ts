import { Module } from '@nestjs/common';
import { DrinkController } from './drink.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from 'src/room/entity/room.entity';
import { UserEntity } from 'src/user/user.entity';
import { DrinkEntity } from './drink.entity';

@Module({
  controllers: [DrinkController],
  imports: [TypeOrmModule.forFeature([UserEntity, DrinkEntity, RoomEntity])],
})
export class DrinkModule {}
