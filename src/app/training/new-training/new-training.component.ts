import { Component, OnInit, OnDestroy } from '@angular/core';

import { TrainingService } from '../training.service';
import { ProfileService } from '../../profile/profile.service';

import { Exercise } from '../exercise.model';

import { Subscription } from 'rxjs';
import { MAT_DATE_FORMATS, DateAdapter } from '@angular/material';
import { AppDateAdapter } from '../../shared/date-adapter';

export const APP_DATE_FORMATS = {
    parse: {
        dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
    },
    display: {
        dateInput: 'my_format',
        // dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
        monthYearLabel: { year: 'numeric', month: 'short' },
        dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
        monthYearA11yLabel: { year: 'numeric', month: 'long' },
    }
};


@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter
  },
  { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
  }]
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
  userWeight: number;
  maxSlider = 25;
  minSlider = 0;
  stepSlider = 1;
  tickIntervalSlider = 1;

  constructor(public trainingService: TrainingService,
              private profileService: ProfileService) { }

  ngOnInit() {
    this.maxDate = new Date();

    this.profileService.getUserData();

    this.fbAvailableExercisesSubs.push(this.profileService.userProfileData
      .subscribe(
        userProfileData => {
          this.userWeight = userProfileData.weight;
        })
    );

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

  formatLabel(value: number) {
    const returnString = value + 'kg ' + Math.round(value / 0.454) + 'lb';
    return returnString;
  }

  ngOnDestroy() {
    if (this.fbAvailableExercisesSubs) {
      this.fbAvailableExercisesSubs.forEach(sub => sub.unsubscribe());
    }
  }

}
