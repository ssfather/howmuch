import React, { useState } from 'react';
import Calendar from '../components/Calendar/Calendar';
import MealList from '../components/MealList/MealList';
import NutritionAnalysis from '../components/NutritionAnalysis';
import { addWeeks, subWeeks } from 'date-fns';

export const MainPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<'record' | 'analysis'>('record');

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleWeekChange = (direction: 'prev' | 'next') => {
    setSelectedDate(prevDate => 
      direction === 'next' ? addWeeks(prevDate, 1) : subWeeks(prevDate, 1)
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex justify-center">
      <div className="w-[400px] py-6">
        <div className="flex justify-center mb-6">
          <img 
            src="/otto.png" 
            alt="Otto" 
            className="h-[100px] w-auto"
          />
        </div>

        <div className="mb-6">
          <Calendar 
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            onWeekChange={handleWeekChange}
          />
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm">
          <div className="flex border-b">
            <button
              className={`flex-1 py-3 text-center text-sm font-medium ${
                activeTab === 'record' 
                  ? 'bg-blue-50/50 text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:bg-gray-50/50'
              }`}
              onClick={() => setActiveTab('record')}
            >
              식사 기록
            </button>
            <button
              className={`flex-1 py-3 text-center text-sm font-medium ${
                activeTab === 'analysis' 
                  ? 'bg-blue-50/50 text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:bg-gray-50/50'
              }`}
              onClick={() => setActiveTab('analysis')}
            >
              영양 분석
            </button>
          </div>

          <div className="p-4">
            {activeTab === 'record' ? (
              <MealList selectedDate={selectedDate} />
            ) : (
              <NutritionAnalysis selectedDate={selectedDate} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage; 