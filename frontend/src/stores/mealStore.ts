import { create } from 'zustand';
import { Meal } from '../types/meal.types';

interface MealStore {
  meals: Meal[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  addMeal: (mealData: Partial<Meal>) => Promise<void>;
  fetchMeals: (date: Date) => Promise<void>;
}

export const useMealStore = create<MealStore>((set) => ({
  meals: [],
  selectedDate: new Date(),
  setSelectedDate: (date) => set({ selectedDate: date }),
  
  addMeal: async (mealData) => {
    try {
      const response = await fetch('http://localhost:3001/meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mealData),
      });

      if (!response.ok) {
        throw new Error('Failed to save meal');
      }

      const savedMeal = await response.json();
      set((state) => ({
        meals: [...state.meals, savedMeal],
      }));
    } catch (error) {
      console.error('Failed to add meal:', error);
      throw error;
    }
  },

  fetchMeals: async (date) => {
    try {
      const response = await fetch(
        `http://localhost:3001/meals?date=${date.toISOString()}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch meals');
      }

      const meals = await response.json();
      set({ meals });
    } catch (error) {
      console.error('Failed to fetch meals:', error);
      throw error;
    }
  },
})); 