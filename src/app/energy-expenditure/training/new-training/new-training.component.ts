import { Component, OnInit, OnDestroy } from '@angular/core';

import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  maxDate: Date;
  minValue = 0;
  today = new Date();
  exercisesTime: Exercise[];
  exerciseTimeSubscription: Subscription;
  exercisesQty: Exercise[];
  exerciseQtySubscription: Subscription;
  exercisesCal: Exercise[];
  exerciseCalSubscription: Subscription;
  panelOpenState = false;

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    this.maxDate = new Date();
    this.exerciseTimeSubscription = this.trainingService.exercisesTimeChanged
      .subscribe(
        exercises => (this.exercisesTime = exercises)
      );
    this.trainingService.fetchAvailableExercisesTime();
    this.exerciseQtySubscription = this.trainingService.exercisesQtyChanged
    .subscribe(
      exercises => (this.exercisesQty = exercises)
    );
    this.trainingService.fetchAvailableExercisesQty();
    this.exerciseCalSubscription = this.trainingService.exercisesCalChanged
    .subscribe(
      exercises => (this.exercisesCal = exercises)
    );
    this.trainingService.fetchAvailableExercisesCal();






    // this.exercisesQty = this.db.collection('availableExercisesQty').valueChanges();
    // this.exercisesCal = this.db.collection('availableExercisesCal').valueChanges();

    // this.exercisesTime = this.trainingService.getAvailableExercisesTime();
    // this.exercisesQty = this.trainingService.getAvailableExercisesQty();
    // this.exercisesCal = this.trainingService.getAvailableExercisesCal();
  }

  saveExercise(dateValue: Date, exercise: string, numValue: number, param: string) {
    console.log(dateValue, exercise, numValue, param);
    this.trainingService.valorizeExercise(dateValue, exercise, numValue, param);
  }

  ngOnDestroy() {
    this.exerciseTimeSubscription.unsubscribe();
    this.exerciseQtySubscription.unsubscribe();
    this.exerciseCalSubscription.unsubscribe();
  }

}
