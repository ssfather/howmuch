import React, { useState, useEffect } from 'react';
import { useMealStore } from '../../stores/mealStore';

interface UserInfo {
  height: number;
  weight: number;
  age: number;
  gender: 'male' | 'female';
  activityLevel: 'low' | 'medium' | 'high';
}

// 영양소 키 타입 정의
type NutritionKey = 'calories' | 'carbs' | 'protein' | 'fat' | 'vitaminA' | 'vitaminB' | 
  'vitaminC' | 'vitaminD' | 'iron' | 'calcium' | 'fiber' | 'sodium';

export const NutritionAnalysis: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const { meals, selectedDate } = useMealStore();

  // 하루 권장 영양소 계산
  const calculateRecommendedNutrition = (info: UserInfo) => {
    const bmr = info.gender === 'male'
      ? 88.362 + (13.397 * info.weight) + (4.799 * info.height) - (5.677 * info.age)
      : 447.593 + (9.247 * info.weight) + (3.098 * info.height) - (4.330 * info.age);

    const activityMultiplier = {
      low: 1.2,
      medium: 1.55,
      high: 1.725
    }[info.activityLevel];

    const dailyCalories = bmr * activityMultiplier;

    // 권장 영양소 계산
    return {
      calories: dailyCalories,
      carbs: (dailyCalories * 0.5) / 4,     // 50% 탄수화물
      protein: (dailyCalories * 0.3) / 4,    // 30% 단백질
      fat: (dailyCalories * 0.2) / 9,        // 20% 지방
      vitaminA: 900,                         // mcg/일
      vitaminB: 1.3,                         // mg/일
      vitaminC: 90,                          // mg/일
      vitaminD: 15,                          // mcg/일
      iron: 8,                               // mg/일
      calcium: 1000,                         // mg/일
      fiber: 25,                             // g/일
      sodium: 2300                           // mg/일
    };
  };

  // 오늘 섭취한 영양소 합계
  const todayNutrition = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + (meal.calories || 0),
      carbs: acc.carbs + (meal.nutritionInfo?.carbs || 0),
      protein: acc.protein + (meal.nutritionInfo?.protein || 0),
      fat: acc.fat + (meal.nutritionInfo?.fat || 0),
      vitaminA: acc.vitaminA + (meal.nutritionInfo?.vitaminA || 0),
      vitaminB: acc.vitaminB + (meal.nutritionInfo?.vitaminB || 0),
      vitaminC: acc.vitaminC + (meal.nutritionInfo?.vitaminC || 0),
      vitaminD: acc.vitaminD + (meal.nutritionInfo?.vitaminD || 0),
      iron: acc.iron + (meal.nutritionInfo?.iron || 0),
      calcium: acc.calcium + (meal.nutritionInfo?.calcium || 0),
      fiber: acc.fiber + (meal.nutritionInfo?.fiber || 0),
      sodium: acc.sodium + (meal.nutritionInfo?.sodium || 0),
    }),
    {
      calories: 0, carbs: 0, protein: 0, fat: 0,
      vitaminA: 0, vitaminB: 0, vitaminC: 0, vitaminD: 0,
      iron: 0, calcium: 0, fiber: 0, sodium: 0
    }
  );

  // 영양소 단위 정보
  const nutritionUnits: Record<NutritionKey, string> = {
    calories: 'kcal',
    carbs: 'g',
    protein: 'g',
    fat: 'g',
    vitaminA: 'mcg',
    vitaminB: 'mg',
    vitaminC: 'mg',
    vitaminD: 'mcg',
    iron: 'mg',
    calcium: 'mg',
    fiber: 'g',
    sodium: 'mg'
  };

  // 영양소 표시 이름
  const nutritionLabels: Record<NutritionKey, string> = {
    calories: '칼로리',
    carbs: '탄수화물',
    protein: '단백질',
    fat: '지방',
    vitaminA: '비타민 A',
    vitaminB: '비타민 B',
    vitaminC: '비타민 C',
    vitaminD: '비타민 D',
    iron: '철분',
    calcium: '칼슘',
    fiber: '식이섬유',
    sodium: '나트륨'
  };

  if (!userInfo) {
    return (
      <div className="p-4 bg-white rounded-xl">
        <h2 className="text-lg font-medium mb-4">개인정보 입력</h2>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            setUserInfo({
              height: Number(formData.get('height')),
              weight: Number(formData.get('weight')),
              age: Number(formData.get('age')),
              gender: formData.get('gender') as 'male' | 'female',
              activityLevel: formData.get('activityLevel') as 'low' | 'medium' | 'high',
            });
          }}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">키 (cm)</label>
            <input
              type="number"
              name="height"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">몸무게 (kg)</label>
            <input
              type="number"
              name="weight"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">나이</label>
            <input
              type="number"
              name="age"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">성별</label>
            <select
              name="gender"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="male">남성</option>
              <option value="female">여성</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">활동량</label>
            <select
              name="activityLevel"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="low">낮음 (좌식 생활)</option>
              <option value="medium">중간 (일반적인 활동)</option>
              <option value="high">높음 (활동적인 생활)</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            분석 시작
          </button>
        </form>
      </div>
    );
  }

  const recommendedNutrition = calculateRecommendedNutrition(userInfo);

  const renderProgressBar = (current: number, recommended: number, label: string) => {
    const percentage = Math.min((current / recommended) * 100, 100);
    return (
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm text-gray-600">
            {current.toFixed(1)} / {recommended.toFixed(1)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  const nutritionKeys: NutritionKey[] = [
    'calories', 'carbs', 'protein', 'fat',
    'vitaminA', 'vitaminB', 'vitaminC', 'vitaminD',
    'iron', 'calcium', 'fiber', 'sodium'
  ];

  return (
    <div className="p-4 bg-white rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">영양 섭취 현황</h2>
        <button
          onClick={() => setUserInfo(null)}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          정보 수정
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {nutritionKeys.map((key) => (
          <div key={key} className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              {nutritionLabels[key]} ({nutritionUnits[key]})
            </h3>
            {renderProgressBar(
              todayNutrition[key],
              recommendedNutrition[key],
              `${nutritionLabels[key]} (${nutritionUnits[key]})`
            )}
          </div>
        ))}
      </div>
    </div>
  );
}; 