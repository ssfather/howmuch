import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meal } from './meal.entity';
import { CreateMealDto } from './dto/create-meal.dto';

@Injectable()
export class MealsService {
  constructor(
    @InjectRepository(Meal)
    private mealsRepository: Repository<Meal>,
  ) {}

  async findAll(date: Date): Promise<Meal[]> {
    return this.mealsRepository.find({
      where: {
        date,
      },
    });
  }

  private mapGptResponseToMeal(gptResponse: any, date?: Date): Partial<Meal> {
    try {
      console.log('[Service] GPT 응답 매핑 시작:', JSON.stringify(gptResponse, null, 2));
      
      // nutrition 정보가 있는지 확인
      if (!gptResponse.nutrition) {
        console.error('[Service] 영양정보 누락');
        throw new BadRequestException('영양정보가 누락되었습니다.');
      }

      // 영양정보 형식 검증
      const requiredNutrients = ['carbs', 'protein', 'fat'];
      for (const nutrient of requiredNutrients) {
        if (typeof gptResponse.nutrition[nutrient] !== 'number') {
          console.error(`[Service] 잘못된 영양정보 형식: ${nutrient}`);
          throw new BadRequestException(`영양정보 ${nutrient}의 형식이 올바르지 않습니다.`);
        }
      }

      const mappedData = {
        type: gptResponse.type,
        name: gptResponse.main_dish,
        sideDishes: gptResponse.side_dishes,
        calories: gptResponse.calories,
        nutritionInfo: {  // nutrition -> nutritionInfo로 명시적 매핑
          carbs: gptResponse.nutrition.carbs,
          protein: gptResponse.nutrition.protein,
          fat: gptResponse.nutrition.fat,
          vitaminA: gptResponse.nutrition.vitaminA,
          vitaminB: gptResponse.nutrition.vitaminB,
          vitaminC: gptResponse.nutrition.vitaminC,
          vitaminD: gptResponse.nutrition.vitaminD,
          iron: gptResponse.nutrition.iron,
          calcium: gptResponse.nutrition.calcium,
          fiber: gptResponse.nutrition.fiber,
          sodium: gptResponse.nutrition.sodium
        },
        date: date || new Date()
      };
      
      console.log('[Service] 매핑된 데이터:', JSON.stringify(mappedData, null, 2));
      return mappedData;
    } catch (error) {
      console.error('[Service] GPT 응답 매핑 실패:', error);
      throw new BadRequestException('GPT 응답 매핑 실패: ' + error.message);
    }
  }

  private validateMealData(mealData: any) {
    console.log('[Service] 데이터 유효성 검사 시작');
    
    try {
      const requiredFields = ['type', 'name', 'calories'];
      for (const field of requiredFields) {
        if (!mealData[field]) {
          console.error(`[Service] 필수 필드 누락: ${field}`);
          throw new BadRequestException(`${field} 필드는 필수입니다.`);
        }
      }

      if (mealData.calories < 0 || mealData.calories > 10000) {
        console.error(`[Service] 잘못된 칼로리 값: ${mealData.calories}`);
        throw new BadRequestException('칼로리는 0에서 10000 사이여야 합니다.');
      }

      if (mealData.nutritionInfo) {
        console.log('[Service] 영양정보 유효성 검사');
        const nutritionFields = ['carbs', 'protein', 'fat'];
        for (const field of nutritionFields) {
          if (mealData.nutritionInfo[field] < 0) {
            console.error(`[Service] 잘못된 영양정보 값: ${field}=${mealData.nutritionInfo[field]}`);
            throw new BadRequestException(`${field}는 0 이상이어야 합니다.`);
          }
        }
      }
      
      console.log('[Service] 데이터 유효성 검사 완료');
    } catch (error) {
      console.error('[Service] 데이터 유효성 검사 실패:', error);
      throw error;
    }
  }

  async create(mealData: CreateMealDto) {
    try {
      console.log('=== [Service] DB 저장 시작 ===');
      console.log('[Service] 원본 데이터:', JSON.stringify(mealData, null, 2));

      // 데이터 유효성 검사
      this.validateMealData(mealData);

      // GPT 응답 데이터 여부 확인 및 매핑
      let mappedData;
      try {
        // 'main_dish' 속성 존재 여부로 GPT 응답 판단
        const isGptResponse = 'main_dish' in mealData;
        console.log('[Service] GPT 응답 여부:', isGptResponse);
        
        mappedData = isGptResponse ? 
          this.mapGptResponseToMeal(mealData) : mealData;
        
        console.log('[Service] 최종 매핑 데이터:', JSON.stringify(mappedData, null, 2));
      } catch (error) {
        console.error('[Service] 데이터 매핑 실패:', error);
        throw new BadRequestException('데이터 매핑 실패: ' + error.message);
      }

      // DB 저장
      try {
        const meal = this.mealsRepository.create(mappedData);
        const savedMeal = await this.mealsRepository.save(meal);
        console.log('[Service] DB 저장 완료:', JSON.stringify(savedMeal, null, 2));
        return savedMeal;
      } catch (error) {
        console.error('[Service] DB 저장 실패:', error);
        throw new InternalServerErrorException('DB 저장 실패: ' + error.message);
      }
    } catch (error) {
      console.error('[Service] 전체 처리 실패:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    await this.mealsRepository.delete(id);
  }
} 