import { Subject } from 'rxjs';
import { Exercise } from './exercise.model';

export class TrainingService {
  exerciseChosen = new Subject<void>();
  showViewTraining = new Subject<void>();
  private availableExercisesTime: Exercise[] = [
   { id: 'aerobics-step-hi', name: 'Aerobics, Step: High Impact', calories: 0.033, duration: 0 },
   { id: 'badminton', name: 'Badminton', calories: 0.015, duration: 0 },
   { id: 'basketball', name: 'Basketball', calories: 0.015, duration: 0 },
   { id: 'weightlifting', name: 'Weight Lifting: general', calories: 0.010, duration: 0 },
   { id: 'bicycling', name: 'Bicycling', calories: 0.027, duration: 0 },
  ];
  private availableExercisesQty: Exercise[] = [
   { id: 'pull-ups', name: 'Pull ups', calories: 0.75, quantity: 0 },
   { id: 'push-ups', name: 'Push ups', calories: 0.5, quantity: 0 },
   { id: 'dips', name: 'Dips', calories: 0.65, quantity: 0 },
  ];
  private availableExercisesCal: Exercise[] = [
   { id: 'walking', name: 'Walking', calories: 0 },
   { id: 'rowing', name: 'Rowing', calories: 0 },
   { id: 'elliptical', name: 'Elliptical', calories: 0 },
   { id: 'stepper', name: 'Stepper', calories: 0 },
   { id: 'threadmill', name: 'Threadmill', calories: 0 },
   { id: 'cycling', name: 'Cycling', calories: 0 },
  ];

  private chosenExercise: Exercise;
  private exercises: Exercise[] = [];

  getAvailableExercisesTime() {
    return this.availableExercisesTime.slice();
  }
  getAvailableExercisesQty() {
    return this.availableExercisesQty.slice();
  }
  getAvailableExercisesCal() {
    return this.availableExercisesCal.slice();
  }

  valorizeExercise(exerciseDate: Date, selectedId: string, volume: number, param: string) {
    this.showViewTraining.next(); // emitting event with no payload
    if (param === 'exTime') {
      this.chosenExercise = this.availableExercisesTime.find(ex => ex.id === selectedId);
      this.exercises.push({
        ...this.chosenExercise,
        duration: volume,
        calories: Math.round(volume * this.chosenExercise.calories),
        date: exerciseDate
      });
    } else if (param === 'exQty') {
      this.chosenExercise = this.availableExercisesQty.find(ex => ex.id === selectedId);
      this.exercises.push({
        ...this.chosenExercise,
        quantity: volume,
        calories: Math.round(volume * this.chosenExercise.calories),
        date: exerciseDate
      });
    } else {
      this.chosenExercise = this.availableExercisesCal.find(ex => ex.id === selectedId);
      this.exercises.push({
        ...this.chosenExercise,
        calories: volume,
        date: exerciseDate
      });
    }
    setTimeout(() => this.exerciseChosen.next(), 100);
    // this.chosenExercise = null;
    console.log(this.exercises);
  }

  getCompletedExercises() {
    return this.exercises.slice();
  }

  getAddedExercise() {
    return {...this.chosenExercise};
  }

}
