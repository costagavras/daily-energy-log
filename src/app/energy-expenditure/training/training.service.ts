import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDatepickerInputEvent } from '@angular/material';

import { Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { Exercise } from './exercise.model';
import { UIService } from 'src/app/shared/ui.service';
import { ProfileService } from 'src/app/profile/profile.service';

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
              private uiService: UIService,
              private profileService: ProfileService) {}

  fetchAvailableExercisesTime() {
    this.firebaseSubscriptions.push(
      this.db.collection<Exercise>('availableExercisesTime', ref => ref.orderBy('name', 'asc')).snapshotChanges()
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
      }, error => {
        this.uiService.showSnackbar('Fetching exercises failed, please try again later', null, 3000);
      }));
  }
  fetchAvailableExercisesQty() {
    this.firebaseSubscriptions.push(
      this.db.collection<Exercise>('availableExercisesQty', ref => ref.orderBy('name', 'asc')).snapshotChanges()
      .pipe(map(docArray => {
        // throw(new Error());
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
      }, error => {
        this.uiService.showSnackbar('Fetching exercises failed, please try again later', null, 3000);
      }));
  }
  fetchAvailableExercisesCal() {
    this.firebaseSubscriptions.push(
      this.db.collection<Exercise>('availableExercisesCal', ref => ref.orderBy('name', 'asc')).snapshotChanges()
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
      }, error => {
        this.uiService.showSnackbar('Fetching exercises failed, please try again later', null, 3000);
      }));
  }

  saveExercise(exerciseDate: Date, selectedId: string, volume: number, userWeight: number, param: string, addWeight: number) {
    if (param === 'exTime') {
      this.chosenExercise = this.availableExercisesTime.find(ex => ex.id === selectedId);
      this.addDataToDatabase({
        ...this.chosenExercise,
        duration: volume,
        caloriesOut: Math.round(volume * this.chosenExercise.caloriesOut * userWeight),
        dateStr: new Date(exerciseDate.setHours(12, 0, 0, 0)).toISOString().substring(0, 10),
        date: new Date(exerciseDate.setHours(12, 0, 0, 0))
      });
    } else if (param === 'exQty') {
      this.chosenExercise = this.availableExercisesQty.find(ex => ex.id === selectedId);
      this.addDataToDatabase({
        ...this.chosenExercise,
        quantity: volume,
        caloriesOut: Math.round(volume * this.chosenExercise.caloriesOut * (userWeight + addWeight)),
        dateStr: new Date(exerciseDate.setHours(12, 0, 0, 0)).toISOString().substring(0, 10),
        date: new Date(exerciseDate.setHours(12, 0, 0, 0))
      });
    } else {
      this.chosenExercise = this.availableExercisesCal.find(ex => ex.id === selectedId);
      this.addDataToDatabase({
        ...this.chosenExercise,
        caloriesOut: volume,
        dateStr: new Date(exerciseDate.setHours(12, 0, 0, 0)).toISOString().substring(0, 10),
        date: new Date(exerciseDate.setHours(12, 0, 0, 0))
      });
    }
  }

  fetchCompletedExercises() {
    this.uiService.loadingStateChanged.next(true);
    const userFirebaseId = this.profileService.getFirebaseUser().uid;

    this.firebaseSubscriptions.push(
      this.db.collection<Exercise>('users/' + userFirebaseId + '/finishedExercises', ref => ref.orderBy('date', 'desc')).valueChanges()
    .subscribe((exercises: Exercise[]) => {
      this.uiService.loadingStateChanged.next(false);
      this.finishedExercisesChanged.next(exercises);
    }, error => {
      this.uiService.loadingStateChanged.next(false);
      this.uiService.showSnackbar('Fetching exercises failed, please try again later', null, 3000);
    }));
  }

  filterDate(event: MatDatepickerInputEvent<Date>) {
    this.dateFilter.next(event.value);
  }

  private addDataToDatabase(exercise: Exercise) {
    const userFirebaseId = this.profileService.getFirebaseUser().uid;
    this.db.collection('users').doc(userFirebaseId).collection('finishedExercises').add(exercise)
    .then(docRef => {
      this.db.collection('users').doc(userFirebaseId).collection('finishedExercises').doc(docRef.id).update({
        id: docRef.id
      });
      // this.uiService.showSnackbar(exercise.name + 'was successfully added', null, 3000);
    });
  }

  // called from the template
  private deleteDataFromDatabase(exercise: Exercise) {
    const userFirebaseId = this.profileService.getFirebaseUser().uid;
    this.db.collection('users').doc(userFirebaseId).collection('finishedExercises').doc(exercise.id).delete();
    this.uiService.showSnackbar(exercise.name + ' was successfully deleted', null, 3000);
  }

  cancelSubscriptions() {
    if (this.firebaseSubscriptions) {
      this.firebaseSubscriptions.forEach(sub => sub.unsubscribe());
    }
  }
}
