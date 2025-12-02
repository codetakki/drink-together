import { Controller, Get, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from '../entity/room.entity';
import { Repository } from 'typeorm';

@Controller('room')
export class RoomController {
  constructor(
    @InjectRepository(RoomEntity)
    private roomRepository: Repository<RoomEntity>,
  ) {}

  @Get()
  async getRooms(): Promise<RoomEntity[]> {
    return await this.roomRepository.find();
  }

  @Post()
  createNewRoom(): RoomEntity {
    return this.roomRepository.create();
  }
}
