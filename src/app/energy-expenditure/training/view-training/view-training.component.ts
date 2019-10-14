import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-view-training',
  templateUrl: './view-training.component.html',
  styleUrls: ['./view-training.component.css']
})
export class ViewTrainingComponent implements OnInit, OnDestroy {
  displayedColumns = ['date', 'name', 'calories', 'duration', 'quantity'];
  dataSource = new MatTableDataSource<Exercise>();
  exerciseSubscription: Subscription;

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    this.exerciseSubscription = this.trainingService.exerciseChosen
    .subscribe(val => this.dataSource.data = this.trainingService.getCompletedExercises());
  }

  ngOnDestroy() {
    this.exerciseSubscription.unsubscribe();
  }

}
