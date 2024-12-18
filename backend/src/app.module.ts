import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MealRecord } from './entities/meal-record.entity';
import { User } from './entities/user.entity';
import { GptVisionService } from './services/gpt-vision.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [MealRecord, User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([MealRecord, User]),
  ],
  controllers: [AppController],
  providers: [AppService, GptVisionService],
})
export class AppModule {} 