import React, { useRef } from 'react';
import { PlusIcon, ArrowDownTrayIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { Meal } from '../../types/meal.types';

interface MealItemProps {
  id: string;
  label: string;
  icon: string;
  items: Meal[];
  onAdd: (id: string, file: File) => void;
  onDownload: (id: string) => void;
}

export const MealItem: React.FC<MealItemProps> = ({
  id,
  label,
  icon,
  items,
  onAdd,
  onDownload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAdd(id, file);
      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-xl">{icon}</span>
          <span className="font-medium">{label}</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onDownload(id)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowDownTrayIcon className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={handleAddClick}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <PlusIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleFileChange}
      />
      
      {items.length > 0 ? (
        <div className="space-y-2">
          {items.map((item) => (
            <div 
              key={item.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                {item.image ? (
                  <img 
                    src={URL.createObjectURL(item.image)} 
                    alt={item.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                    <PhotoIcon className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                <div>
                  <div className="font-medium">{item.name}</div>
                  {item.calories && (
                    <div className="text-sm text-gray-500">{item.calories} kcal</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-3 text-gray-500 text-sm">
          등록된 {label}가 없습니다
        </div>
      )}
    </div>
  );
}; 