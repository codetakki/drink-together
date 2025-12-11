import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DrinkEntity } from './drink.entity';
import { Repository } from 'typeorm';

@Controller('drink')
export class DrinkController {
  constructor(
    @InjectRepository(DrinkEntity)
    private drinkRepository: Repository<DrinkEntity>,
  ) {}

  @Post(':id')
  async updateDrink(
    @Param('id') id: string,
    @Body() updatedDrink: DrinkEntity,
  ) {
    return await this.drinkRepository.update(Number(id), updatedDrink);
  }

  @Delete(':id')
  async deleteDrink(@Param('id') id: string) {
    return await this.drinkRepository.delete(Number(id));
  }
}
