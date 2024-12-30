export interface FoodAnalysis {
  mainDish: string;
  sideDishes: string[];
  type: string;
  calories: number;
  nutrition: {
    carbs: number;
    protein: number;
    fat: number;
    vitaminA?: number;
    vitaminB?: number;
    vitaminC?: number;
    vitaminD?: number;
    iron?: number;
    calcium?: number;
    fiber?: number;
    sodium?: number;
  };
} 