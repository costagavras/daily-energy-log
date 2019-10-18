import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { Subscription } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-past-training',
  templateUrl: './past-training.component.html',
  styleUrls: ['./past-training.component.css']
})
export class PastTrainingComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns = ['date', 'name', 'calories', 'duration', 'quantity', 'actions'];
  dataSource = new MatTableDataSource<Exercise>();
  private paginator: MatPaginator;
  private sort: MatSort;
  totalCalories: number;
  private exerciseChangedSubscription: Subscription;
  private filteredDateSubscription: Subscription;
  private loadingSubs: Subscription;

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
    this.loadingSubs = this.uiService.loadingStateChanged
    .subscribe(isLoading => {
      this.isLoading = isLoading;
    });

    this.updateFilteredDate();

    }

    updateFilteredDate() {
      this.exerciseChangedSubscription = this.trainingService.finishedExercisesChanged
      .subscribe((exercises: Exercise[]) => {
        this.dataSource.data = exercises;
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

    ngOnDestroy() {
      if (this.exerciseChangedSubscription) {
        this.exerciseChangedSubscription.unsubscribe();
      }
      if (this.loadingSubs) {
        this.loadingSubs.unsubscribe();
      }
    }

}
