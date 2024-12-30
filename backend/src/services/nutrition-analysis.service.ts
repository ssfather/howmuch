import { Injectable } from '@nestjs/common';

export interface UserInfo {
  height: number;  // cm
  weight: number;  // kg
  age: number;
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'moderate' | 'active';
}

export interface DailyNutrientNeeds {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  vitaminA: number;
  vitaminB: number;
  vitaminC: number;
  vitaminD: number;
  iron: number;
  calcium: number;
  fiber: number;
  sodium: number;
}

export interface NutritionAnalysis {
  consumed: DailyNutrientNeeds;
  required: DailyNutrientNeeds;
  percentages: DailyNutrientNeeds;
}

@Injectable()
export class NutritionAnalysisService {
  calculateDailyNeeds(userInfo: UserInfo): DailyNutrientNeeds {
    // 기초 대사량 (BMR) 계산 - 해리스-베네딕트 공식 사용
    let bmr = 0;
    if (userInfo.gender === 'male') {
      bmr = 88.362 + (13.397 * userInfo.weight) + (4.799 * userInfo.height) - (5.677 * userInfo.age);
    } else {
      bmr = 447.593 + (9.247 * userInfo.weight) + (3.098 * userInfo.height) - (4.330 * userInfo.age);
    }

    // 활동 수준에 따른 칼로리 조정
    const activityMultipliers = {
      sedentary: 1.2,
      moderate: 1.55,
      active: 1.725
    };
    const dailyCalories = bmr * activityMultipliers[userInfo.activityLevel];

    // 각 영양소별 권장량 계산
    return {
      calories: Math.round(dailyCalories),
      carbs: Math.round((dailyCalories * 0.5) / 4), // 50% of calories from carbs, 1g = 4 calories
      protein: Math.round((dailyCalories * 0.2) / 4), // 20% of calories from protein
      fat: Math.round((dailyCalories * 0.3) / 9), // 30% of calories from fat, 1g = 9 calories
      vitaminA: 900, // mcg
      vitaminB: 1.3, // mg
      vitaminC: 90,  // mg
      vitaminD: 15,  // mcg
      iron: 8,       // mg
      calcium: 1000, // mg
      fiber: 25,     // g
      sodium: 2300   // mg
    };
  }

  analyzeNutrition(consumedMeals: any[], userInfo: UserInfo): NutritionAnalysis {
    // 하루 동안 섭취한 영양소 합계 계산
    const consumed = consumedMeals.reduce((acc, meal) => ({
      calories: acc.calories + meal.calories,
      carbs: acc.carbs + meal.nutrition.carbs,
      protein: acc.protein + meal.nutrition.protein,
      fat: acc.fat + meal.nutrition.fat,
      vitaminA: acc.vitaminA + meal.nutrition.vitaminA,
      vitaminB: acc.vitaminB + meal.nutrition.vitaminB,
      vitaminC: acc.vitaminC + meal.nutrition.vitaminC,
      vitaminD: acc.vitaminD + meal.nutrition.vitaminD,
      iron: acc.iron + meal.nutrition.iron,
      calcium: acc.calcium + meal.nutrition.calcium,
      fiber: acc.fiber + meal.nutrition.fiber,
      sodium: acc.sodium + meal.nutrition.sodium
    }), {
      calories: 0, carbs: 0, protein: 0, fat: 0,
      vitaminA: 0, vitaminB: 0, vitaminC: 0, vitaminD: 0,
      iron: 0, calcium: 0, fiber: 0, sodium: 0
    });

    const required = this.calculateDailyNeeds(userInfo);

    // 섭취 비율 계산
    const percentages = Object.keys(consumed).reduce((acc, key) => ({
      ...acc,
      [key]: Math.round((consumed[key] / required[key]) * 100)
    }), {} as DailyNutrientNeeds);

    return {
      consumed,
      required,
      percentages
    };
  }
} 