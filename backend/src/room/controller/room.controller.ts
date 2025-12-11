import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from '../entity/room.entity';
import { In, Repository } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { DrinkEntity } from 'src/drink/drink.entity';
import { RoomsGateway } from 'src/websocket/rooms.gateway';

@Controller('room')
export class RoomController {
  constructor(
    @InjectRepository(RoomEntity)
    private roomRepository: Repository<RoomEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(DrinkEntity)
    private drinkRepository: Repository<DrinkEntity>,
    private readonly roomsGateway: RoomsGateway,
  ) {}

  /**
   * Create some resource
   */
  @Get()
  async getRooms(): Promise<RoomEntity[]> {
    return await this.roomRepository.find();
  }

  @Get(':code')
  async getRoom(@Param() params: { code: string }): Promise<RoomEntity | null> {
    if (!params.code) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
    const room = await this.roomRepository.findOneBy({
      code: params.code,
    });
    if (!room) {
      throw new HttpException('Could not find room', HttpStatus.NOT_FOUND);
    }
    room.users?.sort((a, b) => {
      // Sort descending (highest promille first)
      return b.promilleAmount - a.promilleAmount;
    });
    return room;
  }

  @Post('/create')
  async createNewRoom(): Promise<RoomEntity> {
    const randomCode = generateRandomCode();
    const createdRoom = this.roomRepository.create({
      code: randomCode,
      name: 'New room',
    });
    return this.roomRepository.save(createdRoom);
  }

  @Post(':code/add-player')
  async addPlayer(
    @Body() player: UserEntity,
    @Param() params: { code: string },
  ): Promise<RoomEntity> {
    if (!params.code) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
    if (!player) {
      console.log('No player');
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
    const newPlayer = this.userRepository.create({
      ...player,
    });
    const room = await this.getRoom(params);
    if (!room) {
      throw new HttpException('not found', HttpStatus.NOT_FOUND);
    }
    if (!room.users) {
      room.users = [];
    }
    room.users.push(newPlayer);

    const newRoom = await this.roomRepository.save(room);
    console.log(newRoom);
    this.roomsGateway.refreshRoom(room.code);
    return newRoom;
  }

  @Put(':code')
  async updateRoom(
    @Param() params: { code: string },
    @Body() updatedRoom: RoomEntity,
  ) {
    if (!params.code) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
    const currentRoom = await this.getRoom(params);
    if (!currentRoom) {
      throw new HttpException('not found', HttpStatus.NOT_FOUND);
    }
    await this.roomRepository.update(currentRoom.id, {
      ...currentRoom,
      ...updatedRoom,
    });
    this.roomsGateway.refreshRoom(params.code);

    return;
  }

  @Post('/add-drinks')
  async addDrinks(@Body() updateDrinksData: AddDrinksDTO) {
    const { players, drink } = updateDrinksData;
    const users = await this.userRepository.find({
      where: {
        id: In(players),
      },
      relations: ['drinks', 'room'],
    });
    const updatedUsers: UserEntity[] = users.map((user) => {
      if (!user.drinks) {
        user.drinks = [];
      }
      const newDrink = this.drinkRepository.create(drink);
      user.drinks.push(newDrink);
      return user;
    });
    const result = await this.userRepository.save(updatedUsers);
    const room_code = updatedUsers[0].room.code;
    this.roomsGateway.refreshRoom(room_code);

    return {
      message: 'Drinks added successfully to users.',
      updatedUsers: result,
    };
  }
}

interface AddDrinksDTO {
  players: UserEntity['id'][];
  drink: DrinkEntity;
}
function generateRandomCode(length: number = 6): string {
  // 1. Define the pool of characters: all letters (case-sensitive) and digits
  const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + '0123456789';

  // 2. Initialize an array to hold the chosen characters
  const codeArray: string[] = [];

  // 3. Loop 'length' times to select characters
  for (let i = 0; i < length; i++) {
    // Generate a random index within the bounds of the 'characters' string
    const randomIndex: number = Math.floor(Math.random() * characters.length);

    // Append the character at the random index to the array
    codeArray.push(characters.charAt(randomIndex));
  }

  // 4. Join the array of characters into a single string
  return codeArray.join('');
}
