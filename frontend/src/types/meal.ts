export interface Meal {
  id: number;
  date: string;
  type: string;
  name: string;
  description: string;
  image?: string;
  sideDishes?: string[];
  calories: number;
  nutritionInfo?: {
    protein: number;
    carbs: number;
    fat: number;
  };
} 