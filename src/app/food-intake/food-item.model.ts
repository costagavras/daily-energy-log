export interface FoodItem {
  id: string;
  name: string;
  serving: number;
  caloriesIn: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  date: Date;
  dateStr: string;
}
