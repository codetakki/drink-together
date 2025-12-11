import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { RoomsGateway } from 'src/websocket/rooms.gateway';

@Controller('user')
export class UserController {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly roomsGateway: RoomsGateway,
  ) {}

  @Post(':id')
  async updateUser(
    @Param('id') idString: string,
    @Body() updatedUser: UserEntity,
  ) {
    const id = Number(idString);
    const oldUser = await this.userRepository.findOne({
      where: {
        id: id,
      },
      relations: ['room'],
    });
    if (!oldUser) {
      throw new HttpException('Could not find user', HttpStatus.NOT_FOUND);
    }
    const newUser = {
      ...oldUser,
      ...updatedUser,
    };
    const savedUser = await this.userRepository.save(newUser);
    if (!savedUser) {
      throw new HttpException(
        'Could not save',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    this.roomsGateway.refreshRoom(oldUser.room.code);

    return savedUser;
  }
}
