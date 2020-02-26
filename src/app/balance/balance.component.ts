import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

import { Exercise } from '../training/exercise.model';
import { FoodItem } from '../food-intake/food-item.model';

import { TrainingService } from '../training/training.service';
import { UIService } from '.././shared/ui.service';
import { FoodService } from '../food-intake/food.service';
import { ProfileService } from '../profile/profile.service';

import { Subscription } from 'rxjs';
import { User, UserStamp } from '../auth/user.model';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css']
})
export class BalanceComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['date', 'food', 'total', 'exercise', 'balance'];
  displayedColumnsGroup = ['Week', 'Month', 'Year'];
  dataSource = new MatTableDataSource<any>();
  objExercises: Exercise[] = [];
  objFoodItems: FoodItem[] = [];
  userStampData: UserStamp[] = [];
  private paginator: MatPaginator;
  private sort: MatSort;

  totalCaloriesIn: number;
  totalCaloriesExercise: number;
  totalDayEnergyExpenditure: number;
  totalCaloriesBalance: number;
  userData: User;
  private balanceSubs: Subscription[] = [];

  isLoading = false;

  // filter
  isGrouperRun = false;
  groupingColumn: string;
  columnName: string;
  reducedGroups = [];
  private initialData: any[] = [];

  @ViewChild(MatSort, {static: false}) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  @ViewChild(MatPaginator, {static: false}) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  constructor(public trainingService: TrainingService,
              private foodService: FoodService,
              private profileService: ProfileService,
              private uiService: UIService) { }

  ngOnInit() {

    this.balanceSubs.push(this.uiService.loadingStateChanged
      .subscribe(isLoading => {
        this.isLoading = isLoading;
    }));

    this.trainingService.fetchCompletedExercises();
    this.foodService.fetchCompletedFoodItems();
    this.profileService.getUserData();
    this.profileService.getUserStampData();
    this.transformData();
  }

  getUserInfo() {
    return new Promise (resolve => {
      this.balanceSubs.push(this.profileService.userProfileData
        .subscribe((userProfileData: User) => {
            this.userData = userProfileData;
            resolve(this.userData);
        }));
    });
  }

  getUserStampInfo() {
    return new Promise (resolve => {
      this.balanceSubs.push(this.profileService.userStampsCollection
        .subscribe((userStamps: UserStamp[]) => {
            this.userStampData = userStamps;
            resolve(this.userStampData);
        }));
    });
  }

  getExercises() {
    return new Promise (resolve => {
      this.balanceSubs.push(this.trainingService.finishedExercisesChanged
        .subscribe((exercises: Exercise[]) => {
          this.objExercises = exercises;
          resolve(this.objExercises);
        }));
    });
  }

  getFoodItems() {
    return new Promise (resolve => {
      this.balanceSubs.push(this.foodService.finishedFoodItemsChanged
        .subscribe((foodItems: FoodItem[]) => {
          this.objFoodItems = foodItems;
          resolve(this.objFoodItems);
        }));
    });
  }

  async transformData() {
    await Promise.all([this.getUserInfo(), this.getUserStampInfo(), this.getExercises(), this.getFoodItems()]);

    const arCombinedData = Array().concat(this.objExercises, this.objFoodItems, this.userStampData);

    // accept array and key (property)
    const groupByProperty = (objectArray, property) => {
      // return the end result
      return objectArray.reduce((resultArray, currentValue) => {
        // create key from the property specified
        const key = currentValue[property];
        // if an array already present for key, push it to the array. Else create an array and push the object
        if (!resultArray[key]) {
          resultArray[key] = [];
        }
        // return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
        resultArray[key].push(currentValue);
        return resultArray;
      }, {});
    };

    const groupedByDate = groupByProperty(arCombinedData, 'dateStr');
    // console.log(groupedByDate);

    const summaryByDay = Object.keys(groupedByDate).map((key => {
      const calsIn = groupedByDate[key].filter(keys => keys.caloriesIn > 0).reduce((total, obj) => obj.caloriesIn + total, 0);
      const calsExercise = groupedByDate[key].filter(keys => keys.caloriesOut > 0).reduce((total, obj) => obj.caloriesOut + total, 0);
      // const totalEnergyDay = userRMR + calsExercise;
      const totalEnergyDay = groupedByDate[key].find(keys => keys.bmr).bmr *
        groupedByDate[key].find(keys => keys.activityLevel).activityLevel + calsExercise;
      const endBalance = calsIn - totalEnergyDay;
      const getTimezoneOffset = new Date(key).getTimezoneOffset();
      const dateAdj4Tz = new Date((Date.parse(key) + (getTimezoneOffset * 60 * 1000)));
      const jan1 = new Date(dateAdj4Tz.getFullYear(), 0, 1);
      const weekNum = Math.ceil((((Date.parse(dateAdj4Tz.toString()) - Date.parse(jan1.toString())) / 86400000) + jan1.getDay() + 1) / 7 );
      const monthNum = dateAdj4Tz.getMonth();
      const yearNum = dateAdj4Tz.getFullYear();

      return {
        date: dateAdj4Tz,
        week: weekNum,
        month: monthNum,
        year: yearNum,
        caloriesIn: Math.round(calsIn),
        caloriesExercise: Math.round(calsExercise),
        totalEnergy: Math.round(totalEnergyDay),
        balance: Math.round(endBalance)
      };
    }));

    // console.log(summaryByDay);
    this.dataSource.data = summaryByDay;
    this.initialData = summaryByDay;
    this.totalCaloriesIn = this.dataSource.data.map(item => item.caloriesIn).reduce((acc, value) => acc + value, 0);
    this.totalCaloriesExercise = this.dataSource.data.map(item => item.caloriesExercise).reduce((acc, value) => acc + value, 0);
    this.totalDayEnergyExpenditure = this.dataSource.data.map(item => item.totalEnergy).reduce((acc, value) => acc + value, 0);
    this.totalCaloriesBalance = this.dataSource.data.map(item => item.balance).reduce((acc, value) => acc + value, 0);
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
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
    let collapsedGroups = reducedGroups;
    if (!reducedGroups) { collapsedGroups = []; }
    let groupCaloriesIn = 0;
    let groupCaloriesTDEE = 0;
    let groupCaloriesEx = 0;
    let groupCaloriesBal = 0;
    let addGroupCaloriesIn = {};
    let addGroupCaloriesTDEE = {};
    let addGroupCaloriesEx = {};
    let addGroupCaloriesBal = {};
    const customReducer = (accumulator, currentValue) => {
      const currentGroup = currentValue[column]; // each of the items in names column
      if (!accumulator[currentGroup]) {
          accumulator[currentGroup] = [{
            groupName: currentValue[column],
            value: currentValue[column],
            isGroup: true,
            reduced: collapsedGroups.some((group) => group.value === currentValue[column]),
          }];
          groupCaloriesIn = 0;
          groupCaloriesTDEE = 0;
          groupCaloriesEx = 0;
          groupCaloriesBal = 0;
        }

      // updating CaloriesIn total
      if (accumulator[currentGroup][0].totalCaloriesGrpIn) {
        groupCaloriesIn = accumulator[currentGroup][0].totalCaloriesGrpIn;
      }
      // groupCaloriesIn = groupCaloriesIn + currentValue.caloriesIn;
      addGroupCaloriesIn = {
        totalCaloriesGrpIn: groupCaloriesIn += currentValue.caloriesIn, // adding calories to group
      };

      // updating CaloriesTDEE total
      if (accumulator[currentGroup][0].totalCaloriesGrpTDEE) {
        groupCaloriesTDEE = accumulator[currentGroup][0].totalCaloriesGrpTDEE;
      }
      addGroupCaloriesTDEE = {
        totalCaloriesGrpTDEE: groupCaloriesTDEE += currentValue.totalEnergy, // adding calories to group
      };

      // updating CaloriesEx total
      if (accumulator[currentGroup][0].totalCaloriesGrpEx) {
        groupCaloriesEx = accumulator[currentGroup][0].totalCaloriesGrpEx;
      }
      addGroupCaloriesEx = {
        totalCaloriesGrpEx: groupCaloriesEx += currentValue.caloriesExercise, // adding calories to group
      };

      // updating CaloriesBal total
      if (accumulator[currentGroup][0].totalCaloriesGrpBal) {
        groupCaloriesBal = accumulator[currentGroup][0].totalCaloriesGrpBal;
      }
      addGroupCaloriesBal = {
        totalCaloriesGrpBal: groupCaloriesBal += currentValue.balance, // adding calories to group
      };

      // merging calories to accumulator
      accumulator[currentGroup][0] =
        Object.assign(accumulator[currentGroup][0], addGroupCaloriesIn, addGroupCaloriesTDEE, addGroupCaloriesEx, addGroupCaloriesBal);
      accumulator[currentGroup].push(currentValue);
      return accumulator;
    };

    const groups = data.reduce(customReducer, {});
    const groupArray = Object.keys(groups).map(key => groups[key]).reverse();
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
    this.dataSource = this.groupBy(this.columnName, this.initialData, this.reducedGroups);
  }

  ngOnDestroy() {
    if (this.balanceSubs) {
      this.balanceSubs.forEach(sub => sub.unsubscribe());
    }
  }

}
