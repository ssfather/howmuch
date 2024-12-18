import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MealRecord } from './entities/meal-record.entity';
import { NutritionTotal } from './interfaces/nutrition.interface';
import { v4 as uuidv4 } from 'uuid';
import { MealType } from './interfaces/meal-type.interface';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(MealRecord)
    private mealRecordRepository: Repository<MealRecord>,
  ) {}

  async getMealRecordsByDate(date: string) {
    try {
      console.log('조회 요청된 날짜:', date);
      const records = await this.mealRecordRepository
        .createQueryBuilder('meal_record')
        .where('DATE(meal_record.date) = :date', { date })
        .orderBy('meal_record.mealType', 'ASC')
        .getMany();

      // 프론트엔드 형식에 맞게 데이터 변환
      return records.map(record => {
        const nutritionData = JSON.parse(record.nutrition);
        return {
          id: record.id,
          type: record.mealType,
          name: nutritionData.main_dish,
          description: record.memo || '',
          sideDishes: nutritionData.side_dishes || [],
          calories: nutritionData.calories,
          nutritionInfo: nutritionData.nutrition
        };
      });
    } catch (error) {
      console.error('식사 기록 조회 중 오류:', error);
      throw error;
    }
  }

  async getNutritionByDate(date: string): Promise<NutritionTotal> {
    try {
      // 해당 날짜의 모든 식사 기록 조회
      const records = await this.mealRecordRepository
        .createQueryBuilder('meal_record')
        .where('DATE(meal_record.date) = :date', { date })
        .getMany();

      // 초기값 설정
      const initialValue: NutritionTotal = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        vitaminA: 0,
        vitaminB: 0,
        vitaminC: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 0,
        fiber: 0,
        sodium: 0
      };

      // 모든 식사 기록의 영양소 합산
      return records.reduce((acc: NutritionTotal, record) => {
        const nutrition = JSON.parse(record.nutrition);
        return {
          calories: acc.calories + (nutrition.calories || 0),
          protein: acc.protein + (nutrition.nutrition.protein || 0),
          carbs: acc.carbs + (nutrition.nutrition.carbs || 0),
          fat: acc.fat + (nutrition.nutrition.fat || 0),
          vitaminA: acc.vitaminA + (nutrition.nutrition.vitaminA || 0),
          vitaminB: acc.vitaminB + (nutrition.nutrition.vitaminB || 0),
          vitaminC: acc.vitaminC + (nutrition.nutrition.vitaminC || 0),
          vitaminD: acc.vitaminD + (nutrition.nutrition.vitaminD || 0),
          iron: acc.iron + (nutrition.nutrition.iron || 0),
          calcium: acc.calcium + (nutrition.nutrition.calcium || 0),
          fiber: acc.fiber + (nutrition.nutrition.fiber || 0),
          sodium: acc.sodium + (nutrition.nutrition.sodium || 0)
        };
      }, initialValue);
    } catch (error) {
      console.error('영양 정보 조회 중 오류:', error);
      throw error;
    }
  }

  async createMealRecord(data: any) {
    try {
      console.log('저장할 데이터:', data);
      const mealRecord = this.mealRecordRepository.create({
        id: uuidv4(),
        userId: 'test-user',
        date: new Date(data.date),
        mealType: data.type,
        nutrition: data.nutrition,
        imageUrl: data.imageUrl,
        memo: data.description,
        createdAt: new Date()
      });

      const result = await this.mealRecordRepository.save(mealRecord);
      return result;
    } catch (error) {
      console.error('식사 기록 생성 중 오류:', error);
      throw error;
    }
  }
} 