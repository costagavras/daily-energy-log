import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

import { FoodItem } from '../food-item.model';
import { FoodService } from '../food.service';
import { Subscription } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-view-food-intake',
  templateUrl: './view-food-intake.component.html',
  styleUrls: ['./view-food-intake.component.css']
})
export class ViewFoodIntakeComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['date', 'name', 'serving', 'calories', 'protein', 'carbs', 'fat', 'actions'];
  dataSource = new MatTableDataSource<FoodItem>();
  private paginator: MatPaginator;
  private sort: MatSort;
  filteredDay: Date;
  startFilteredDay: number;
  endFilteredDay: number;
  totalCalories: number;
  private foodChangedSubscription: Subscription;
  private filteredDateSubscription: Subscription;
  private loadingSubs: Subscription;

  isLoading = false;

  @ViewChild(MatSort, {static: false}) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  @ViewChild(MatPaginator, {static: false}) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }
  constructor(public foodService: FoodService,
              private uiService: UIService) { }

  ngOnInit() {
    this.loadingSubs = this.uiService.loadingStateChanged
    .subscribe(isLoading => {
      this.isLoading = isLoading;
    });
    this.filteredDay = new Date();
    this.startFilteredDay = this.filteredDay.setHours(0, 0, 0, 0);
    this.endFilteredDay = this.filteredDay.setHours(24, 0, 0, -1);

    // subscription when filter date changes
    this.filteredDateSubscription = this.foodService.dateFilter
    .subscribe((date: Date) => {
        this.filteredDay = date; // comes from datepicker change event formatted as 0:0:00
        this.startFilteredDay = this.filteredDay.setHours(0, 0, 0, 0);
        this.endFilteredDay = this.filteredDay.setHours(24, 0, 0, -1);
        this.updateFilteredDate();
      });

    this.updateFilteredDate();

    }

    updateFilteredDate() {
      this.foodChangedSubscription = this.foodService.finishedFoodItemChanged
      .subscribe((foodItem: FoodItem[]) => {
        // this.dataSource.data = exercises;
        this.dataSource.data = foodItem.filter(val => {
          return val.date['seconds'] * 1000 >= this.startFilteredDay &&
          val.date['seconds'] * 1000  <= this.endFilteredDay;
        });
        this.totalCalories = this.dataSource.data.map(fdIt => fdIt.calories).reduce((acc, value) => acc + value, 0);
      });
      this.foodService.fetchCompletedFoodItems();
    }

    ngAfterViewInit() {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }

    doFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    ngOnDestroy() {
      if (this.foodChangedSubscription) {
        this.foodChangedSubscription.unsubscribe();
      }
      if (this.filteredDateSubscription) {
        this.filteredDateSubscription.unsubscribe();
      }
      if (this.loadingSubs) {
        this.loadingSubs.unsubscribe();
      }
    }

}
