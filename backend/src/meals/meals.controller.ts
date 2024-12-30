import { Controller, Post, Get, UseInterceptors, UploadedFile, Query, Body, Param, Delete, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GptVisionService } from '../services/gpt-vision.service';
import { MealsService } from './meals.service';
import * as multer from 'multer';
import { CreateMealDto } from './dto/create-meal.dto';
import { ValidationError } from 'class-validator';

@Controller('meals')
export class MealsController {
  constructor(
    private readonly mealsService: MealsService,
    private readonly gptVisionService: GptVisionService,
  ) {}

  @Post('analyze')
  @UseInterceptors(FileInterceptor('image'))
  async analyzeImage(
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      if (!file) {
        throw new Error('이미지 파일이 필요합니다.');
      }

      const analysis = await this.gptVisionService.analyzeImage(file);
      return analysis;
    } catch (error) {
      console.error('이미지 분석 중 오류:', error);
      throw error;
    }
  }

  @Get()
  async getMeals(@Query('date') dateStr: string) {
    try {
      console.log('=== 식사 목록 조회 요청 ===');
      console.log('요청 날짜:', dateStr);

      if (!dateStr) {
        console.log('날짜가 제공되지 않음, 빈 배열 반환');
        return [];
      }

      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        console.log('유효하지 않은 날짜:', dateStr);
        return [];
      }

      const meals = await this.mealsService.findAll(date);
      console.log('조회된 식사 수:', meals.length);
      return meals;
    } catch (error) {
      console.error('식사 목록 조회 실패:', error);
      // 에러가 발생해도 빈 배열 반환
      return [];
    }
  }

  @Post()
  async createMeal(@Body() mealData: CreateMealDto) {
    try {
      console.log('=== 식사 저장 시작 ===');
      console.log('[Controller] 받은 데이터:', JSON.stringify(mealData, null, 2));

      // 기본값 설정
      if (!mealData.date) {
        console.log('[Controller] 날짜 기본값 설정');
        mealData.date = new Date();
      }
      if (!mealData.sideDishes) {
        console.log('[Controller] 반찬 기본값 설정');
        mealData.sideDishes = [];
      }
      if (!mealData.nutritionInfo) {
        console.log('[Controller] 영양정보 기본값 설정');
        mealData.nutritionInfo = {
          carbs: 0,
          protein: 0,
          fat: 0
        };
      }

      console.log('[Controller] Service 호출 전 데이터:', JSON.stringify(mealData, null, 2));
      const result = await this.mealsService.create(mealData);
      console.log('[Controller] 저장 완료. 결과:', JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      console.error('=== 식사 저장 중 에러 발생 ===');
      console.error('[Controller] 에러 타입:', error.constructor.name);
      console.error('[Controller] 에러 메시지:', error.message);
      console.error('[Controller] 에러 스택:', error.stack);
      
      if (error instanceof ValidationError) {
        console.error('[Controller] 유효성 검사 실패:', error.constraints);
        throw new BadRequestException({
          message: '데이터 유효성 검사 실패',
          details: error.constraints
        });
      }
      
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      throw new InternalServerErrorException({
        message: '서버 내부 오류',
        error: error.message
      });
    }
  }

  @Delete(':id')
  async deleteMeal(@Param('id') id: string) {
    await this.mealsService.delete(Number(id));
    return { success: true };
  }
} 