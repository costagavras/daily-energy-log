import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { UIService } from 'src/app/shared/ui.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-training',
  templateUrl: './view-training.component.html',
  styleUrls: ['./view-training.component.css']
})
export class ViewTrainingComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['date', 'name', 'calories', 'duration', 'quantity', 'actions'];
  dataSource = new MatTableDataSource<Exercise>();
  private paginator: MatPaginator;
  private sort: MatSort;
  filteredDay: Date;
  startFilteredDay: number;
  endFilteredDay: number;
  totalCalories: number;
  private viewTrainingSubs: Subscription[] = [];

  isLoading = false;

  @ViewChild(MatSort, {static: false}) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  @ViewChild(MatPaginator, {static: false}) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }
  constructor(public trainingService: TrainingService,
              private uiService: UIService) { }

  ngOnInit() {
    this.viewTrainingSubs.push(this.uiService.loadingStateChanged
    .subscribe(isLoading => {
      this.isLoading = isLoading;
    }));
    this.filteredDay = new Date();
    this.startFilteredDay = this.filteredDay.setHours(0, 0, 0, 0);
    this.endFilteredDay = this.filteredDay.setHours(24, 0, 0, -1);

    // subscription when filter date changes
    this.viewTrainingSubs.push(this.trainingService.dateFilter
    .subscribe((date: Date) => {
        this.filteredDay = date; // comes from datepicker change event formatted as 0:0:00
        this.startFilteredDay = this.filteredDay.setHours(0, 0, 0, 0);
        this.endFilteredDay = this.filteredDay.setHours(24, 0, 0, -1);
        this.updateFilteredDate();
      }));

    this.updateFilteredDate();

    }

    updateFilteredDate() {
      this.viewTrainingSubs.push(this.trainingService.finishedExercisesChanged
      .subscribe((exercises: Exercise[]) => {
        // this.dataSource.data = exercises;
        this.dataSource.data = exercises.filter(val => {
          return val.date['seconds'] * 1000 >= this.startFilteredDay &&
          val.date['seconds'] * 1000  <= this.endFilteredDay;
        });
        this.totalCalories = this.dataSource.data.map(ex => ex.caloriesOut).reduce((acc, value) => acc + value, 0);
      }));
      this.trainingService.fetchCompletedExercises();
    }

    ngAfterViewInit() {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }

    doFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    ngOnDestroy() {
      if (this.viewTrainingSubs) {
        this.viewTrainingSubs.forEach(sub => sub.unsubscribe());
      }
    }

}
