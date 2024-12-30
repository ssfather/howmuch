import React from 'react';
import { Calendar } from '../components/Calendar/Calendar';
import { MealList } from '../components/MealList/MealList';
import { useMealStore } from '../stores/mealStore';

export const CalendarTest: React.FC = () => {
  const { selectedDate } = useMealStore();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto space-y-4">
        <Calendar />
        <MealList />
        <div className="mt-4 p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-medium">선택된 날짜:</h2>
          <p className="mt-2">
            {selectedDate.toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long',
            })}
          </p>
        </div>
      </div>
    </div>
  );
}; 