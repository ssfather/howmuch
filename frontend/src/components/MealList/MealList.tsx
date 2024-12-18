import React, { useEffect, useState, useCallback } from 'react';
import { format } from 'date-fns';
import { AddMealModal } from './AddMealModal';
import { MealDetail } from './MealDetail';

interface MealListProps {
  selectedDate: Date;
}

interface Meal {
  id: number;
  type: string;
  name: string;
  description: string;
  image?: string;
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
}

const MealList: React.FC<MealListProps> = ({ selectedDate }) => {
  console.log('MealList 렌더링, selectedDate:', selectedDate);
  
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<string | null>(null);

  const mealTypes = [
    { id: 'breakfast', icon: '☀️', label: '아침 식사', bgColor: 'bg-yellow-50' },
    { id: 'lunch', icon: '☕️', label: '점심 식사', bgColor: 'bg-gradient-to-r from-blue-50 to-green-50' },
    { id: 'dinner', icon: '🍽️', label: '저녁 식사', bgColor: 'bg-purple-50' },
    { id: 'snack1', icon: '🍪', label: '간식 1', bgColor: 'bg-gradient-to-r from-cyan-50 to-rose-50' },
    { id: 'snack2', icon: '🌙', label: '간식 2', bgColor: 'bg-gradient-to-r from-rose-50 to-cyan-50' },
  ];

  const fetchMeals = useCallback(async () => {
    console.log('fetchMeals 함수 실행');
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      console.log('조회할 날짜:', formattedDate);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`http://localhost:3001/api/meals?date=${formattedDate}`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Failed to fetch meals');
      }
      
      const data = await response.json();
      console.log('서버에서 받은 식사 데이터:', data);
      setMeals(Array.isArray(data) ? data : []);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request was aborted');
        return;
      }
      console.error('fetchMeals 에러:', error);
      setMeals([]);
    }
  }, [selectedDate]);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      if (mounted) {
        await fetchMeals();
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [selectedDate, fetchMeals]);

  const handleAddMeal = async (data: any) => {
    console.log('handleAddMeal 실행, 데이터:', data);
    try {
      setIsLoading(true);
      const formData = new FormData();
      
      if (data.image) {
        formData.append('image', data.image, data.image.name);
      }
      
      formData.append('date', selectedDate.toISOString());
      formData.append('type', data.type);
      formData.append('name', data.name);
      if (data.description) {
        formData.append('description', data.description);
      }

      const response = await fetch('http://localhost:3001/api/meals', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add meal');
      }

      const result = await response.json();
      console.log('식사 추가 결과:', result);
      
      await fetchMeals();
      setIsModalOpen(false);
    } catch (error) {
      console.error('식사 추가 중 오류:', error);
      alert(error.message || '식사 추가 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {mealTypes.map((type) => (
        <div key={type.id} className={`${type.bgColor} rounded-xl p-4`}>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center space-x-2">
              <span>{type.icon}</span>
              <span className="font-medium text-sm">{type.label}</span>
            </div>
            <button
              onClick={() => {
                setIsModalOpen(true);
                setSelectedMealType(type.id);
              }}
              className="px-4 py-1.5 text-sm bg-white/80 rounded-lg hover:bg-white transition-colors"
            >
              +
            </button>
          </div>
          
          {meals.filter(meal => meal.type === type.id).map((meal) => (
            <div 
              key={meal.id} 
              className="mt-2 p-3 bg-white/60 rounded-lg cursor-pointer hover:bg-white/80 transition-all"
              onClick={() => {
                console.log('선택된 식사 데이터:', meal);
                setSelectedMeal(meal);
              }}
            >
              <h3 className="font-medium text-sm">
                {meal.name || '메뉴 정보 없음'}
              </h3>
              
              {meal.sideDishes && meal.sideDishes.length > 0 && (
                <p className="text-xs text-gray-600 mt-1">
                  {meal.sideDishes.join(', ')}
                </p>
              )}
              
              <p className="text-xs text-gray-500 mt-1">
                {meal.calories ? `${meal.calories}kcal` : '열량 정보 없음'}
              </p>
            </div>
          ))}
        </div>
      ))}

      <AddMealModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMealType(null);
        }}
        onSubmit={handleAddMeal}
        isLoading={isLoading}
        mealType={selectedMealType || ''}
      />

      {selectedMeal && (
        <MealDetail
          meal={selectedMeal}
          isOpen={!!selectedMeal}
          onClose={() => setSelectedMeal(null)}
        />
      )}
    </div>
  );
};

export default MealList;