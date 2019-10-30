import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

import { Exercise } from '../energy-expenditure/training/exercise.model';
import { FoodItem } from '../food-intake/food-item.model';

import { TrainingService } from '../energy-expenditure/training/training.service';
import { UIService } from '.././shared/ui.service';
import { FoodService } from '../food-intake/food.service';
import { ProfileService } from '../profile/profile.service';

import { Subscription } from 'rxjs';
import { User } from '../auth/user.model';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css']
})
export class BalanceComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['date', 'food', 'total', 'exercise', 'balance'];
  dataSourceExercises = new MatTableDataSource<Exercise>();
  dataSourceFoodItems = new MatTableDataSource<FoodItem>();
  objExercises: Exercise[] = [];
  objFoodItems: FoodItem[] = [];
  dataSource = new MatTableDataSource<any>();
  private paginator: MatPaginator;
  private sort: MatSort;

  totalCalories: number;
  userData: User;
  private balanceSubs: Subscription[] = [];

  isLoading = false;

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
    await Promise.all([this.getUserInfo(), this.getExercises(), this.getFoodItems()]);
    // console.log(this.userData);
    // console.log(this.objExercises);
    // console.log(this.objFoodItems);

    const userRMR = this.userData.bmr * this.userData.activityLevel;
    const arCombinedData = Array().concat(this.objExercises, this.objFoodItems);

    // console.log(arCombinedData);

    function groupBy(objectArray, property) {
      return objectArray.reduce((acc, obj) => {
        const key = obj[property];
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
      }, {});
    }

    const groupedByDate = groupBy(arCombinedData, 'dateStr');
    // console.log(groupedByDate);

    const summaryByDay = Object.keys(groupedByDate).map((key => {
      console.log(key);
      // console.log(groupedByDate[key]);
      const calsIn = groupedByDate[key].filter(keys => keys.caloriesIn > 0).reduce((total, obj) => obj.caloriesIn + total, 0);
      const calsOut = groupedByDate[key].filter(keys => keys.caloriesOut > 0).reduce((total, obj) => obj.caloriesOut + total, 0);
      const totalEnergyDay = userRMR + calsIn;
      const endBalance = calsIn - totalEnergyDay;
      const timeCorrection = new Date().getTimezoneOffset;
      return {
        date: new Date(key).toISOString(),
        caloriesIn: Math.round(calsIn),
        caloriesOut: Math.round(calsOut),
        totalEnergy: Math.round(totalEnergyDay),
        balance: Math.round(endBalance)
      };
    }));

    console.log(summaryByDay);

    this.dataSource.data = summaryByDay;
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  ngOnDestroy() {
    if (this.balanceSubs) {
      this.balanceSubs.forEach(sub => sub.unsubscribe());
    }
  }

}
