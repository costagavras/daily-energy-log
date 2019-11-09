import { Component, OnInit, OnDestroy } from '@angular/core';

import { FoodService } from '../food.service';
import { FoodItem } from '../food-item.model';
import { Subscription } from 'rxjs';

import { MAT_DATE_FORMATS, DateAdapter } from '@angular/material';
import { AppDateAdapter } from 'src/app/shared/date-adapter';

export const APP_DATE_FORMATS = {
  parse: {
      dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
  },
  display: {
      dateInput: 'my_format',
      // dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
      monthYearLabel: { year: 'numeric', month: 'short' },
      dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
      monthYearA11yLabel: { year: 'numeric', month: 'long' },
  }
};

@Component({
  selector: 'app-new-food-intake',
  templateUrl: './new-food-intake.component.html',
  styleUrls: ['./new-food-intake.component.css'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter
  },
  { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
  }]
})

export class NewFoodIntakeComponent implements OnInit, OnDestroy {
  maxDate: Date;
  minValue = 0;
  today = new Date();
  foodItemsBeverages: FoodItem[];
  foodItemsDairy: FoodItem[];
  foodItemsDesserts: FoodItem[];
  foodItemsDishes: FoodItem[];
  foodItemsFats: FoodItem[];
  foodItemsFish: FoodItem[];
  foodItemsFruits: FoodItem[];
  foodItemsGrains: FoodItem[];
  foodItemsMeat: FoodItem[];
  foodItemsVegetables: FoodItem[];
  foodItemsOther: FoodItem[];
  private fbAvailableFoodItemsSubs: Subscription[] = [];

  panelOpenState = false;

  constructor(public foodService: FoodService) { }

  ngOnInit() {
    this.maxDate = new Date();

    this.fbAvailableFoodItemsSubs.push(this.foodService.foodItemsBeveragesChanged
      .subscribe(
        foodItems => (this.foodItemsBeverages = foodItems)
      ));
    this.foodService.fetchAvailableFoodItemsBeverages();

    this.fbAvailableFoodItemsSubs.push(this.foodService.foodItemsDairyChanged
      .subscribe(
        foodItems => (this.foodItemsDairy = foodItems)
      ));
    this.foodService.fetchAvailableFoodItemsDairy();

    this.fbAvailableFoodItemsSubs.push(this.foodService.foodItemsDessertsChanged
      .subscribe(
        foodItems => (this.foodItemsDesserts = foodItems)
      ));
    this.foodService.fetchAvailableFoodItemsDesserts();

    this.fbAvailableFoodItemsSubs.push(this.foodService.foodItemsDishesChanged
      .subscribe(
        foodItems => (this.foodItemsDishes = foodItems)
      ));
    this.foodService.fetchAvailableFoodItemsDishes();

    this.fbAvailableFoodItemsSubs.push(this.foodService.foodItemsFatsChanged
      .subscribe(
        foodItems => (this.foodItemsFats = foodItems)
      ));
    this.foodService.fetchAvailableFoodItemsFats();

    this.fbAvailableFoodItemsSubs.push(this.foodService.foodItemsFishChanged
      .subscribe(
        foodItems => (this.foodItemsFish = foodItems)
      ));
    this.foodService.fetchAvailableFoodItemsFish();

    this.fbAvailableFoodItemsSubs.push(this.foodService.foodItemsFruitsChanged
      .subscribe(
        foodItems => (this.foodItemsFruits = foodItems)
      ));
    this.foodService.fetchAvailableFoodItemsFruits();

    this.fbAvailableFoodItemsSubs.push(this.foodService.foodItemsGrainsChanged
      .subscribe(
        foodItems => (this.foodItemsGrains = foodItems)
      ));
    this.foodService.fetchAvailableFoodItemsGrains();

    this.fbAvailableFoodItemsSubs.push(this.foodService.foodItemsMeatChanged
      .subscribe(
        foodItems => (this.foodItemsMeat = foodItems)
      ));
    this.foodService.fetchAvailableFoodItemsMeat();

    this.fbAvailableFoodItemsSubs.push(this.foodService.foodItemsVegetablesChanged
      .subscribe(
        foodItems => (this.foodItemsVegetables = foodItems)
      ));
    this.foodService.fetchAvailableFoodItemsVegetables();

    this.fbAvailableFoodItemsSubs.push(this.foodService.foodItemsOtherChanged
      .subscribe(
        foodItems => (this.foodItemsOther = foodItems)
      ));
    this.foodService.fetchAvailableFoodItemsOther();

  }

  ngOnDestroy() {
    if (this.fbAvailableFoodItemsSubs) {
      this.fbAvailableFoodItemsSubs.forEach(sub => sub.unsubscribe());
    }
  }

}

