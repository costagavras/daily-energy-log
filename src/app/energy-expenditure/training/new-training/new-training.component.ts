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
  minValue = 0;
  today = new Date();
  exercisesTime: Exercise[] = [];
  exercisesQty: Exercise[] = [];
  exercisesCal: Exercise[] = [];
  panelOpenState = false;

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    this.maxDate = new Date();
    this.exercisesTime = this.trainingService.getAvailableExercisesTime();
    this.exercisesQty = this.trainingService.getAvailableExercisesQty();
    this.exercisesCal = this.trainingService.getAvailableExercisesCal();
  }

  saveExercise(dateValue: Date, exercise: string, numValue: number, param: string) {
    console.log(dateValue, exercise, numValue, param);
    this.trainingService.chooseExercise(dateValue, exercise, numValue, param);
    // this.trainingService.chooseExercise(form.value.exercise, form.value.date);
    // form.reset();
  }
}
