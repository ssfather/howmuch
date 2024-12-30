import React from 'react';

interface MealDetailProps {
  meal: {
    id: number;
    type: string;
    name: string;
    description: string;
    sideDishes: string[];
    calories: number;
    nutritionInfo: {
      protein: number;
      carbs: number;
      fat: number;
      vitaminA: number;
      vitaminB: number;
      vitaminC: number;
      vitaminD: number;
      iron: number;
      calcium: number;
      fiber: number;
      sodium: number;
    };
  };
  isOpen: boolean;
  onClose: () => void;
}

export const MealDetail: React.FC<MealDetailProps> = ({ meal, isOpen, onClose }) => {
  if (!isOpen) return null;

  console.log('MealDetail에 전달된 데이터:', meal);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">식사 상세 정보</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="mb-4">
          <h3 className="font-medium">메인 메뉴</h3>
          <p>{meal.name}</p>
        </div>

        {meal.sideDishes && meal.sideDishes.length > 0 && (
          <div className="mb-4">
            <h3 className="font-medium">반찬</h3>
            <ul className="list-disc list-inside">
              {meal.sideDishes.map((dish, index) => (
                <li key={index}>{dish}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mb-4">
          <h3 className="font-medium mb-2">기본 영양소</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">칼로리</p>
              <p className="font-medium">{meal.calories} kcal</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">단백질</p>
              <p className="font-medium">{meal.nutritionInfo.protein}g</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">탄수화물</p>
              <p className="font-medium">{meal.nutritionInfo.carbs}g</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">지방</p>
              <p className="font-medium">{meal.nutritionInfo.fat}g</p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-medium mb-2">상세 영양소</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">비타민 A</p>
              <p className="font-medium">{meal.nutritionInfo.vitaminA} mcg</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">비타민 B</p>
              <p className="font-medium">{meal.nutritionInfo.vitaminB} mg</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">비타민 C</p>
              <p className="font-medium">{meal.nutritionInfo.vitaminC} mg</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">비타민 D</p>
              <p className="font-medium">{meal.nutritionInfo.vitaminD} mcg</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">철분</p>
              <p className="font-medium">{meal.nutritionInfo.iron} mg</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">칼슘</p>
              <p className="font-medium">{meal.nutritionInfo.calcium} mg</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">식이섬유</p>
              <p className="font-medium">{meal.nutritionInfo.fiber} g</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">나트륨</p>
              <p className="font-medium">{meal.nutritionInfo.sodium} mg</p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          닫기
        </button>
      </div>
    </div>
  );
}; 