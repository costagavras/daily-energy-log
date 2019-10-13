import { Exercise } from './exercise.model';

export class TrainingService {
  private availableExercises: Exercise[] = [
   { id: 'aerobics-step-hi', name: 'Aerobics, Step: High Impact', calories: 0.033, duration: 1 },
   { id: 'badminton', name: 'Badminton', duration: 1, calories: 0.015 },
   { id: 'basketball', name: 'Basketball', duration: 1, calories: 0.015 },
   { id: 'bicycling', name: 'Bicycling', duration: 1, calories: 0.027 },
   { id: 'weightlifting', name: 'Weight Lifting: general', duration: 1, calories: 0.010 },
   { id: 'pull-ups', name: 'Pull ups', calories: 0.75, quantity: 1 },
   { id: 'push-ups', name: 'Push ups', calories: 0.5, quantity: 1 },
   { id: 'dips', name: 'Dips', calories: 0.65, quantity: 1 },
  ];

  private chosenExercise: Exercise;

  getAvailableExercises() {
    return this.availableExercises.slice();
  }

  chooseExercise(selectedId: string) {
    this.chosenExercise = this.availableExercises.find(ex => ex.id === selectedId);
  }

}