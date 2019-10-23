export interface User {
  id: string;
  name: string;
  email: string;
  gender: string;
  age: number;
  weight: number;
  height: number;
  bmr: number;
  activityLevel: number;
  rmr: number; // BMR * activity level (extra ex+walking)
}
