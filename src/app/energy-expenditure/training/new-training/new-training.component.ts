import { Component, OnInit } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  maxDate: Date;
  // dateValue: Date;
  // timeValue: number;
  minValue = 0;
  today = new Date();
  // exercise: Exercise;
  exercises: Exercise[] = [];
  panelOpenState = false;

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    this.maxDate = new Date();
    this.exercises = this.trainingService.getAvailableExercises();
  }

  onEnter(form: NgForm) {
    console.log(form.value);
    if (form.value.exerciseTime) {
      this.trainingService.chooseExercise(form.value.exerciseTime, form.value.date);
    } else if (form.value.exerciseQty) {
      this.trainingService.chooseExercise(form.value.exerciseQty, form.value.date);
    } else if (form.value.exerciseCals) {
      this.trainingService.chooseExercise(form.value.exerciseCals, form.value.date);
    }
  }

  saveExerciseTime(dateValue: Date, exercise: Exercise, timeValue: number) {
    console.log(dateValue, exercise, timeValue);
    // this.trainingService.chooseExercise(form.value.exercise, form.value.date);
    // form.reset();
  }


}
