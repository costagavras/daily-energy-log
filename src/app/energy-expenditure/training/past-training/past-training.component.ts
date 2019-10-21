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
  displayedColumnsGroup = ['Date', 'Name'];
  useDatePipe: boolean;
  dataSource = new MatTableDataSource<Exercise>();
  private sort: MatSort;
  totalCalories: number;
  private exerciseChangedSubscription: Subscription;
  private loadingSubs: Subscription;
  panelOpenState = false;
  isLoading = false;
  isGrouperRun = false;

  // filter
  groupingColumn;
  columnName: string;
  reducedGroups = [];
  private initialData: Exercise[] = [];

  @ViewChild(MatSort, {static: false}) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  constructor(public trainingService: TrainingService,
              private uiService: UIService) {}

  ngOnInit() {
    this.loadingSubs = this.uiService.loadingStateChanged
    .subscribe(isLoading => {
      this.isLoading = isLoading;
    });
    this.fetchAllExercises();
    console.log('I ran');
  }

  // filter
  buildDataSource() {
    this.reducedGroups = [];
    this.isGrouperRun = true; // avoid showing filter and sort after group is activated
    this.groupingColumn === null ? this.columnName = null : this.columnName = this.groupingColumn.toLowerCase();
    this.dataSource = this.groupBy(this.columnName, this.initialData, this.reducedGroups);
  }

  // filter
  groupBy(column: string, data: any[], reducedGroups?: any[]) {
    if (!column) { return data; }
    column === 'date' ? this.useDatePipe = true : this.useDatePipe = false; // make sure date pipe is correct in template
    let collapsedGroups = reducedGroups;
    if (!reducedGroups) { collapsedGroups = []; }
    let groupCalories = 0;
    let addGroupCalories = {};
    const customReducer = (accumulator, currentValue) => {
      const currentGroup = currentValue[column]; // each of the items in names column
      if (!accumulator[currentGroup]) {
          accumulator[currentGroup] = [{
            groupName: currentValue[column],
            value: JSON.stringify(currentValue[column].seconds), // hack to avoid Timestamp object with sec and nanosec
            isGroup: true,
            reduced: collapsedGroups.some((group) => group.value === JSON.stringify(currentValue[column].seconds)),
          }];
          groupCalories = 0;
        }

      if (accumulator[currentGroup][0].totalCaloriesGrp) {
        groupCalories = accumulator[currentGroup][0].totalCaloriesGrp;
      }
      groupCalories = groupCalories + currentValue.calories;

      addGroupCalories = {
        totalCaloriesGrp: groupCalories, // adding calories to group
      };

      accumulator[currentGroup][0] = Object.assign(accumulator[currentGroup][0], addGroupCalories); // mergin calories to accumulator
      accumulator[currentGroup].push(currentValue);
      return accumulator;
    };

    const groups = data.reduce(customReducer, {});
    const groupArray = Object.keys(groups).map(key => groups[key]);
    const flatList = groupArray.reduce((a, c) => a.concat(c), []);


    return flatList.filter((rawLine) => {
        return rawLine.isGroup ||
        collapsedGroups.every((group) => JSON.stringify(rawLine[column].seconds) !== group.value);
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
    this.dataSource = this.groupBy(this.columnName, this.initialData, this.reducedGroups);
  }

  // event listener
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
