import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';

import { FoodItem } from '../food-item.model';
import { FoodService } from '../food.service';
import { Subscription } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-past-food-intake',
  templateUrl: './past-food-intake.component.html',
  styleUrls: ['./past-food-intake.component.css']
})
export class PastFoodIntakeComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns = ['date', 'name', 'serving', 'calories', 'protein', 'carbs', 'fat', 'actions'];
  displayedColumnsGroup = ['Date', 'Name'];
  useDatePipe: boolean;
  dataSource = new MatTableDataSource<FoodItem>();
  private sort: MatSort;
  totalCalories: number;
  private pastFoodIntakeSubs: Subscription[] = [];
  panelOpenState = false;
  isLoading = false;
  isGrouperRun = false;

  // filter
  groupingColumn;
  columnName: string;
  reducedGroups = [];
  private initialData: FoodItem[] = [];

  @ViewChild(MatSort, {static: false}) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  constructor(public foodService: FoodService,
              private uiService: UIService) {}

  ngOnInit() {
    this.pastFoodIntakeSubs.push(this.uiService.loadingStateChanged
    .subscribe(isLoading => {
      this.isLoading = isLoading;
    }));
    this.fetchAllFoods();
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
      groupCalories = groupCalories + currentValue.caloriesIn;

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
  fetchAllFoods() {
    this.pastFoodIntakeSubs.push(this.foodService.finishedFoodItemsChanged
    .subscribe((foodItems: FoodItem[]) => {
      this.dataSource.data = foodItems;
      this.initialData = foodItems;
      this.totalCalories = this.dataSource.data.map(fdIt => fdIt.caloriesIn).reduce((acc, value) => acc + value, 0);
    }));
    this.foodService.fetchCompletedFoodItems();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
    if (this.pastFoodIntakeSubs) {
      this.pastFoodIntakeSubs.forEach(sub => sub.unsubscribe());
    }
  }

}
