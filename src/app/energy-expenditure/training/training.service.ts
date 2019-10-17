import { Injectable } from '@angular/core';
import { AngularFirestore, fromDocRef } from '@angular/fire/firestore';
import { MatDatepickerInputEvent } from '@angular/material';

import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Exercise } from './exercise.model';

@Injectable()
export class TrainingService {
  showViewTraining = new Subject<void>();
  exercisesTimeChanged = new Subject<Exercise[]>();
  exercisesQtyChanged = new Subject<Exercise[]>();
  exercisesCalChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  dateFilter = new Subject<Date>();
  private availableExercisesTime: Exercise[] = [];
  private availableExercisesQty: Exercise[] = [];
  private availableExercisesCal: Exercise[] = [];

  private chosenExercise: Exercise;

  constructor(private db: AngularFirestore) {}

  fetchAvailableExercisesTime() {
    this.db.collection('availableExercisesTime').snapshotChanges()
      .pipe(map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            // name: doc.payload.doc.data()['name'],
            // duration: doc.payload.doc.data()['duration'],
            // quantity: doc.payload.doc.data()['quantity'],
            // calories: doc.payload.doc.data()['calories'],
            // date: doc.payload.doc.data()['date']
            ...doc.payload.doc.data()
          } as Exercise;
        });
      }))
      .subscribe((exercises: Exercise[]) => {
        this.availableExercisesTime = exercises;
        this.exercisesTimeChanged.next([...this.availableExercisesTime]);
      });
  }
  fetchAvailableExercisesQty() {
    this.db.collection('availableExercisesQty').snapshotChanges()
      .pipe(map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            ...doc.payload.doc.data()
          } as Exercise;
        });
      }))
      .subscribe((exercises: Exercise[]) => {
        this.availableExercisesQty = exercises;
        this.exercisesQtyChanged.next([...this.availableExercisesQty]);
      });
  }
  fetchAvailableExercisesCal() {
    this.db.collection('availableExercisesCal').snapshotChanges()
      .pipe(map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            ...doc.payload.doc.data()
          } as Exercise;
        });
      }))
      .subscribe((exercises: Exercise[]) => {
        this.availableExercisesCal = exercises;
        this.exercisesCalChanged.next([...this.availableExercisesCal]);
      });
  }

  saveExercise(exerciseDate: Date, selectedId: string, volume: number, param: string) {
    if (param === 'exTime') {
      this.chosenExercise = this.availableExercisesTime.find(ex => ex.id === selectedId);
      this.addDataToDatabase({
        ...this.chosenExercise,
        duration: volume,
        calories: Math.round(volume * this.chosenExercise.calories),
        date: exerciseDate
      });
    } else if (param === 'exQty') {
      this.chosenExercise = this.availableExercisesQty.find(ex => ex.id === selectedId);
      this.addDataToDatabase({
        ...this.chosenExercise,
        quantity: volume,
        calories: Math.round(volume * this.chosenExercise.calories),
        date: exerciseDate
      });
    } else {
      this.chosenExercise = this.availableExercisesCal.find(ex => ex.id === selectedId);
      this.addDataToDatabase({
        ...this.chosenExercise,
        calories: volume,
        date: exerciseDate
      });
    }
  }

  fetchCompletedExercises() {
    this.db.collection('finishedExercises').valueChanges()
      .subscribe((exercises: Exercise[]) => {
        this.finishedExercisesChanged.next(exercises);
      });
  }

  filterDate(event: MatDatepickerInputEvent<Date>) {
    this.dateFilter.next(event.value);
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises/').add(exercise)
      .then(docRef => {
        this.db.collection('finishedExercises/').doc(docRef.id).update({
          id: docRef.id
        });
      });
  }

  // called from the template
  private deleteDataFromDatabase(exercise: Exercise) {
    this.db.doc('finishedExercises/' + exercise.id).delete();
  }

}
