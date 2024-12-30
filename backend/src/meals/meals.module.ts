import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealsController } from './meals.controller';
import { MealsService } from './meals.service';
import { Meal } from './meal.entity';
import { GptVisionService } from '../services/gpt-vision.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Meal]),
    MulterModule.register({
      dest: './uploads',
    }),
    ConfigModule,
  ],
  controllers: [MealsController],
  providers: [MealsService, GptVisionService],
})
export class MealsModule {} 