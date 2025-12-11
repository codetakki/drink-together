import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DrinkEntity } from './drink.entity';
import { Repository } from 'typeorm';
import { RoomsGateway } from 'src/websocket/rooms.gateway';

@Controller('drink')
export class DrinkController {
  constructor(
    @InjectRepository(DrinkEntity)
    private drinkRepository: Repository<DrinkEntity>,
    private readonly roomsGateway: RoomsGateway,
  ) {}

  @Post(':id')
  async updateDrink(
    @Param('id') id: string,
    @Body() updatedDrink: DrinkEntity,
  ) {
    const drink = await this.drinkRepository.findOne({
      where: {
        id: Number(id),
      },
      relations: {
        user: {
          room: true,
        },
      },
    });
    if (!drink) {
      throw new HttpException('Could not find drink', HttpStatus.NOT_FOUND);
    }
    this.roomsGateway.refreshRoom(drink.user.room.code);
    return await this.drinkRepository.update(Number(id), updatedDrink);
  }

  @Delete(':id')
  async deleteDrink(@Param('id') id: string) {
    const drink = await this.drinkRepository.findOne({
      where: {
        id: Number(id),
      },
      relations: {
        user: {
          room: true,
        },
      },
    });
    if (!drink) {
      throw new HttpException('Could not find drink', HttpStatus.NOT_FOUND);
    }
    this.roomsGateway.refreshRoom(drink.user.room.code);
    return await this.drinkRepository.delete(Number(id));
  }
}
