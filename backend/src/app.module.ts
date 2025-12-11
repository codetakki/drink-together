import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomModule } from './room/room.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { DrinkModule } from './drink/drink.module';

@Module({
  imports: [
    RoomModule,
    UserModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'drinking.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    DrinkModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
