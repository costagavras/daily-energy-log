export interface FoodItem {
  id: string;
  name: string;
  serving: number;
  caloriesIn: number;
  protein?: number;
  carb?: number;
  fat?: number;
  date: Date;
  dateStr: string;
}
