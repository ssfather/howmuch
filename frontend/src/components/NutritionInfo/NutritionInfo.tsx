import React from 'react';

interface NutritionInfoProps {
  nutritionData: {
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
  };
}

export const NutritionInfo: React.FC<NutritionInfoProps> = ({ nutritionData }) => {
  const nutritionItems = [
    { label: '칼로리', value: nutritionData.calories, unit: 'kcal', target: 2000 },
    { label: '탄수화물', value: nutritionData.carbs, unit: 'g', target: 300 },
    { label: '단백질', value: nutritionData.protein, unit: 'g', target: 50 },
    { label: '지방', value: nutritionData.fat, unit: 'g', target: 65 },
    { label: '비타민 A', value: nutritionData.vitaminA, unit: 'μg', target: 900 },
    { label: '비타민 B', value: nutritionData.vitaminB, unit: 'mg', target: 1.3 },
    // ... 나머지 영양소들
  ];

  return (
    <div className="nutrition-info">
      {nutritionItems.map((item) => (
        <div key={item.label} className="nutrition-item">
          <span className="label">{item.label}</span>
          <div className="progress-bar">
            <div 
              className="progress"
              style={{ width: `${(item.value / item.target) * 100}%` }}
            />
          </div>
          <span className="value">
            {item.value} / {item.target} {item.unit}
          </span>
        </div>
      ))}
    </div>
  );
}; 