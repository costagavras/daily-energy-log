import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-view-training',
  templateUrl: './view-training.component.html',
  styleUrls: ['./view-training.component.css']
})
export class ViewTrainingComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['date', 'name', 'calories', 'duration', 'quantity', 'actions'];
  dataSource = new MatTableDataSource<Exercise>();
  filteredDay: Date;
  startFilteredDay: number;
  endFilteredDay: number;
  private exerciseChangedSubscription: Subscription;
  private filteredDateSubscription: Subscription;

  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(public trainingService: TrainingService) { }
  totalCalories: number;

  ngOnInit() {
    this.filteredDay = new Date();
    this.startFilteredDay = this.filteredDay.setHours(0, 0, 0, 0);
    this.endFilteredDay = this.filteredDay.setHours(24, 0, 0, -1);
    // console.log(new Date(this.startFilteredDay));
    // console.log(new Date(this.endFilteredDay));

    this.filteredDateSubscription = this.trainingService.dateFilter
      .subscribe((date: Date) => {
        this.filteredDay = date; // comes from datepicker change event formatted as 0:0:00
        this.startFilteredDay = this.filteredDay.setHours(0, 0, 0, 0);
        this.endFilteredDay = this.filteredDay.setHours(24, 0, 0, -1);
        // console.log(new Date(this.startFilteredDay));
        // console.log(new Date(this.endFilteredDay));
        this.updateFilteredDate();
      });

    this.exerciseChangedSubscription = this.trainingService.finishedExercisesChanged
    .subscribe((exercises: Exercise[]) => {
      // this.dataSource.data = exercises; // non filtered data
        this.dataSource.data = exercises.filter(val => {
          return val.date['seconds'] * 1000 >= this.startFilteredDay &&
                val.date['seconds'] * 1000  <= this.endFilteredDay;
        });
        this.totalCalories = this.dataSource.data.map(ex => ex.calories).reduce((acc, value) => acc + value, 0);
      });
    this.trainingService.fetchCompletedExercises();
    }

    updateFilteredDate() {
      this.exerciseChangedSubscription = this.trainingService.finishedExercisesChanged
      .subscribe((exercises: Exercise[]) => {
        // this.dataSource.data = exercises;
        this.dataSource.data = exercises.filter(val => {
          return val.date['seconds'] * 1000 >= this.startFilteredDay &&
          val.date['seconds'] * 1000  <= this.endFilteredDay;
        });
        this.totalCalories = this.dataSource.data.map(ex => ex.calories).reduce((acc, value) => acc + value, 0);
      });
      this.trainingService.fetchCompletedExercises();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // rowClicked(row) {
  //   console.log(this.dataSource.data);
  //   const index = this.dataSource.data.indexOf(this.dataSource.data.find(ex => ex.id === row.id));
  //   console.log(index);
  //   this.dataSource.data.splice(index, 1);
  //   console.log(this.dataSource.data);
  //   this.trainingService.fetchCompletedExercises();
  // }

  ngOnDestroy() {
    this.exerciseChangedSubscription.unsubscribe();
    this.filteredDateSubscription.unsubscribe();
  }

}
