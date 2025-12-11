import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from 'src/room/entity/room.entity';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';

@Controller('user')
export class UserController {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  @Post(':id')
  async updateUser(
    @Param('id') idString: string,
    @Body() updatedUser: UserEntity,
  ) {
    const id = Number(idString);
    const oldUser = await this.userRepository.findBy({ id });
    if (!oldUser) {
      throw new HttpException('Could not find user', HttpStatus.NOT_FOUND);
    }
    const newUser = {
      ...oldUser,
      ...updatedUser,
    };
    const savedUsers = await this.userRepository.save(newUser);
    const savedUser = savedUsers['0'];
    if (!savedUser) {
      throw new HttpException(
        'Could not save',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return savedUser;
  }
}
