import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

interface NutritionProps {
  selectedDate: Date;
}

interface NutritionTotal {
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

interface UserInfo {
  height: number;
  weight: number;
  age: number;
  gender: 'male' | 'female';
}

export const NutritionAnalysis: React.FC<NutritionProps> = ({ selectedDate }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    height: 170,
    weight: 65,
    age: 25,
    gender: 'male'
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [nutritionTotal, setNutritionTotal] = useState<NutritionTotal>({
    calories: 0,
    carbs: 0,
    protein: 0,
    fat: 0,
    vitaminA: 0,
    vitaminB: 0,
    vitaminC: 0,
    vitaminD: 0,
    iron: 0,
    calcium: 0,
    fiber: 0,
    sodium: 0
  });

  // Mifflin-St Jeor 공식으로 BMR 계산
  const calculateBMR = () => {
    const { weight, height, age, gender } = userInfo;
    // BMR = (10 × 체중kg) + (6.25 × 키cm) - (5 × 나이) + s(남:+5, 여:-161)
    const base = (10 * weight) + (6.25 * height) - (5 * age);
    return gender === 'male' ? base + 5 : base - 161;
  };

  // 권장 섭취량 계산
  const calculateRecommended = () => {
    const bmr = calculateBMR();
    const dailyCalories = bmr * 1.375; // 보통 활동량 기준

    return {
      calories: Math.round(dailyCalories),
      carbs: Math.round(dailyCalories * 0.5 / 4), // 50% 탄수화물
      protein: Math.round(dailyCalories * 0.3 / 4), // 30% 단백질
      fat: Math.round(dailyCalories * 0.2 / 9), // 20% 지방
      vitaminA: 900,
      vitaminB: 1.3,
      vitaminC: 90,
      vitaminD: 600,
      iron: userInfo.gender === 'male' ? 8 : 18, // 성별에 따른 철분 권장량
      calcium: 1000,
      fiber: 25,
      sodium: 2300
    };
  };

  const [dailyRecommended, setDailyRecommended] = useState(calculateRecommended());

  useEffect(() => {
    setDailyRecommended(calculateRecommended());
  }, [userInfo]);

  useEffect(() => {
    const fetchNutritionTotal = async () => {
      try {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        const response = await fetch(`http://localhost:3001/api/nutrition?date=${formattedDate}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch nutrition data');
        }
        
        const data = await response.json();
        setNutritionTotal(data);
      } catch (error) {
        console.error('영양 정보 조회 중 오류:', error);
      }
    };

    fetchNutritionTotal();
  }, [selectedDate]);

  const handleSave = () => {
    setIsEditing(false);
    // 여기에 신체 정보 저장 로직 추가 가능
  };

  const handleChange = (field: keyof UserInfo, value: number | string) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">신체 정보</h2>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            {isEditing ? '저장' : '수정'}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-lg">
            <p className="text-sm text-gray-600">키 (cm)</p>
            {isEditing ? (
              <input
                type="number"
                value={userInfo.height}
                onChange={(e) => handleChange('height', Number(e.target.value))}
                className="w-full text-lg font-medium border rounded px-2 py-1"
              />
            ) : (
              <p className="text-lg font-medium">{userInfo.height}</p>
            )}
          </div>
          <div className="p-4 bg-white rounded-lg">
            <p className="text-sm text-gray-600">몸무게 (kg)</p>
            {isEditing ? (
              <input
                type="number"
                value={userInfo.weight}
                onChange={(e) => handleChange('weight', Number(e.target.value))}
                className="w-full text-lg font-medium border rounded px-2 py-1"
              />
            ) : (
              <p className="text-lg font-medium">{userInfo.weight}</p>
            )}
          </div>
          <div className="p-4 bg-white rounded-lg">
            <p className="text-sm text-gray-600">나이</p>
            {isEditing ? (
              <input
                type="number"
                value={userInfo.age}
                onChange={(e) => handleChange('age', Number(e.target.value))}
                className="w-full text-lg font-medium border rounded px-2 py-1"
              />
            ) : (
              <p className="text-lg font-medium">{userInfo.age}</p>
            )}
          </div>
          <div className="p-4 bg-white rounded-lg">
            <p className="text-sm text-gray-600">성별</p>
            {isEditing ? (
              <select
                value={userInfo.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="w-full text-lg font-medium border rounded px-2 py-1"
              >
                <option value="male">남성</option>
                <option value="female">여성</option>
              </select>
            ) : (
              <p className="text-lg font-medium">
                {userInfo.gender === 'male' ? '남성' : '여성'}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">영양소 섭취 현황</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(nutritionTotal).map(([key, value]) => {
            const recommended = dailyRecommended[key as keyof typeof dailyRecommended];
            const percentage = Math.round((value / recommended) * 100);
            
            return (
              <div key={key} className="p-4 bg-white rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-600">
                    {key === 'calories' ? '칼로리' :
                     key === 'carbs' ? '탄수화물' :
                     key === 'protein' ? '단백질' :
                     key === 'fat' ? '지방' :
                     key === 'vitaminA' ? '비타민 A' :
                     key === 'vitaminB' ? '비타민 B' :
                     key === 'vitaminC' ? '비타민 C' :
                     key === 'vitaminD' ? '비타민 D' :
                     key === 'iron' ? '철분' :
                     key === 'calcium' ? '칼슘' :
                     key === 'fiber' ? '식이섬유' :
                     '나트륨'}
                  </p>
                  <p className="text-sm text-gray-500">{percentage}%</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 rounded-full h-2"
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                <p className="text-sm mt-1">
                  {value} / {recommended} {
                    key === 'calories' ? 'kcal' :
                    key.includes('vitamin') ? (key === 'vitaminD' ? 'mcg' : 'mg') :
                    key === 'sodium' || key === 'calcium' ? 'mg' :
                    'g'
                  }
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NutritionAnalysis; 