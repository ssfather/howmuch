import React from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onWeekChange: (direction: 'prev' | 'next') => void;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelect, onWeekChange }) => {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  
  const getWeekDates = () => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 0 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => onWeekChange('prev')} className="p-1">
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <span className="text-lg font-medium">
          {format(selectedDate, 'yyyy년 MM월', { locale: ko })}
        </span>
        <button onClick={() => onWeekChange('next')} className="p-1">
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map(day => (
          <div key={day} className="text-center text-sm text-gray-500 py-2">
            {day}
          </div>
        ))}
        {getWeekDates().map((date, index) => (
          <button
            key={index}
            onClick={() => onDateSelect(date)}
            className={`
              p-2 text-sm rounded-full
              ${date.toDateString() === selectedDate.toDateString()
                ? 'bg-blue-100 text-blue-600 font-medium'
                : 'hover:bg-gray-50'
              }
            `}
          >
            {format(date, 'd')}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calendar; 