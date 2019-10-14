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
  exercises: Exercise[] = [];
  panelOpenState = false;

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    this.maxDate = new Date();
    this.exercises = this.trainingService.getAvailableExercises();
  }

  onEnter(form: NgForm) {
    console.log(form.value);
    this.trainingService.chooseExercise(form.value.exercise, form.value.date);
  }
}
