export interface Exercise {
  id: string;
  name: string;
  calories: number;
  duration?: number;
  quantity?: number;
  date: Date;
  dateStr: string;
}
