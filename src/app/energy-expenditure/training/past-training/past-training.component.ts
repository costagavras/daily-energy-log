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
  displayedColumnsGroup = ['date', 'name'];
  useDatePipe: boolean;
  dataSource = new MatTableDataSource<Exercise>();
  private paginator: MatPaginator;
  private sort: MatSort;
  totalCalories: number;
  private exerciseChangedSubscription: Subscription;
  private loadingSubs: Subscription;
  panelOpenState = false;
  isLoading = false;

  // filter
  groupingColumn;
  reducedGroups = [];
  private initialData: Exercise[] = [];

  @ViewChild(MatSort, {static: false}) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  @ViewChild(MatPaginator, {static: false}) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  constructor(public trainingService: TrainingService,
              private uiService: UIService) {}

  ngOnInit() {
    this.loadingSubs = this.uiService.loadingStateChanged
    .subscribe(isLoading => {
      this.isLoading = isLoading;
    });

    this.fetchAllExercises();

  }

  // filter
  buildDataSource() {

    this.dataSource = this.groupBy(this.groupingColumn, this.initialData, this.reducedGroups);
  }

  // filter
  groupBy(column: string, data: any[], reducedGroups?: any[]) {
    if (!column) { return data; }
    column === 'name' ? this.useDatePipe = false : this.useDatePipe = true;
    let collapsedGroups = reducedGroups;
    if (!reducedGroups) { collapsedGroups = []; }
    const customReducer = (accumulator, currentValue) => {
      const currentGroup = currentValue[column];
      if (!accumulator[currentGroup]) {
        accumulator[currentGroup] = [{
          groupName: currentValue[column],
          value: currentValue[column],
          isGroup: true,
          reduced: collapsedGroups.some((group) => group.value === currentValue[column])
        }];
      }

      accumulator[currentGroup].push(currentValue);
      // console.log(currentValue);
      return accumulator;
    };

    const groups = data.reduce(customReducer, {});
    const groupArray = Object.keys(groups).map(key => groups[key]);
    const flatList = groupArray.reduce((a, c) => a.concat(c), []);


    return flatList.filter((rawLine) => {
        return rawLine.isGroup ||
        collapsedGroups.every((group) => rawLine[column] !== group.value);
      });
  }

  // filter
  isGroup(index, item): boolean {
    return item.isGroup;
  }

  // filter
  reduceGroup(row) {
    row.reduced = !row.reduced;
    if (row.reduced) {
      this.reducedGroups.push(row);
    } else {
      this.reducedGroups = this.reducedGroups.filter((el) => el.value !== row.value);
    }
    this.buildDataSource();
  }

  fetchAllExercises() {
    this.exerciseChangedSubscription = this.trainingService.finishedExercisesChanged
    .subscribe((exercises: Exercise[]) => {
      this.dataSource.data = exercises;
      this.initialData = exercises;
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
