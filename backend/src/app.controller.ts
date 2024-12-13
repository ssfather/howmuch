import { Controller, Get, Post, Body, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AppService } from './app.service';
import { GptVisionService } from './services/gpt-vision.service';
import { NutritionTotal } from './interfaces/nutrition.interface';

@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly gptVisionService: GptVisionService
  ) {}

  @Get('meals')
  async getMeals(@Query('date') date: string) {
    console.log('GET /meals 요청 받음, date:', date);
    try {
      const result = await this.appService.getMealRecordsByDate(date);
      console.log('조회 결과:', result);
      return result;
    } catch (error) {
      console.error('getMeals 에러:', error);
      throw error;
    }
  }

  @Get('nutrition')
  async getNutrition(@Query('date') date: string): Promise<NutritionTotal> {
    try {
      return this.appService.getNutritionByDate(date);
    } catch (error) {
      console.error('영양 정보 조회 중 오류:', error);
      throw error;
    }
  }

  @Post('meals')
  @UseInterceptors(FileInterceptor('image', {
    storage: memoryStorage()
  }))
  async addMeal(
    @Body() mealData: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      if (!file) {
        throw new Error('이미지 파일이 필요합니다.');
      }

      let nutritionInfo = await this.gptVisionService.analyzeImage(file);
      console.log('GPT 분석 결과:', nutritionInfo);

      const result = await this.appService.createMealRecord({
        date: mealData.date || new Date().toISOString(),
        type: mealData.type,
        nutrition: JSON.stringify(nutritionInfo),
        imageUrl: file.filename,
        userId: 'test-user'
      });

      return result;
    } catch (error) {
      console.error('식사 추가 중 오류:', error);
      throw error;
    }
  }
} 