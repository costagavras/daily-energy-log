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
  exercisesQty: Exercise[];
  exercisesCal: Exercise[];
  private fbAvailableExercisesSubs: Subscription[] = [];
  panelOpenState = false;

  constructor(public trainingService: TrainingService) { }

  ngOnInit() {
    this.maxDate = new Date();

    this.fbAvailableExercisesSubs.push(this.trainingService.exercisesTimeChanged
      .subscribe(
        exercises => (this.exercisesTime = exercises)
      ));
    this.trainingService.fetchAvailableExercisesTime();

    this.fbAvailableExercisesSubs.push(this.trainingService.exercisesQtyChanged
    .subscribe(
      exercises => (this.exercisesQty = exercises)
    ));
    this.trainingService.fetchAvailableExercisesQty();

    this.fbAvailableExercisesSubs.push(this.trainingService.exercisesCalChanged
    .subscribe(
      exercises => (this.exercisesCal = exercises)
    ));
    this.trainingService.fetchAvailableExercisesCal();
  }

  ngOnDestroy() {
    if (this.fbAvailableExercisesSubs) {
      this.fbAvailableExercisesSubs.forEach(sub => sub.unsubscribe());
    }
  }

}
