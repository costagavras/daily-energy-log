import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDatepickerInputEvent } from '@angular/material';

import { Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { Exercise } from './exercise.model';
import { UIService } from 'src/app/shared/ui.service';

@Injectable()
export class TrainingService {
  exercisesTimeChanged = new Subject<Exercise[]>();
  exercisesQtyChanged = new Subject<Exercise[]>();
  exercisesCalChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  dateFilter = new Subject<Date>();
  private availableExercisesTime: Exercise[] = [];
  private availableExercisesQty: Exercise[] = [];
  private availableExercisesCal: Exercise[] = [];

  private chosenExercise: Exercise;
  private firebaseSubscriptions: Subscription[] = [];

  constructor(private db: AngularFirestore,
              private uiService: UIService) {}

  fetchAvailableExercisesTime() {
    this.firebaseSubscriptions.push(this.db.collection('availableExercisesTime').snapshotChanges()
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
      }));
  }
  fetchAvailableExercisesQty() {
    this.firebaseSubscriptions.push(this.db.collection('availableExercisesQty').snapshotChanges()
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
      }));
  }
  fetchAvailableExercisesCal() {
    this.firebaseSubscriptions.push(this.db.collection('availableExercisesCal').snapshotChanges()
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
      }));
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
    this.uiService.loadingStateChanged.next(true);
    this.firebaseSubscriptions.push(this.db.collection('finishedExercises').valueChanges()
    .subscribe((exercises: Exercise[]) => {
      this.uiService.loadingStateChanged.next(false);
      this.finishedExercisesChanged.next(exercises);
    }));
  }

  cancelSubscriptions() {
    this.firebaseSubscriptions.forEach(sub => sub.unsubscribe());
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
