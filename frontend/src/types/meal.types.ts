export interface NutritionInfo {
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
}

export interface Meal {
  id: number;
  type: string;
  name: string;
  sideDishes?: string[];
  calories: number;
  nutritionInfo?: NutritionInfo;
  date: Date;
}

export interface AnalysisResult {
  main_dish: string;
  side_dishes: string[];
  type: string;
  calories: number;
  nutrition: NutritionInfo;
} 