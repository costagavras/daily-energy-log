import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';

import { FoodService } from '../food.service';
import { FoodItem } from '../food-item.model';
import { Subscription } from 'rxjs';

import { MAT_DATE_FORMATS, DateAdapter, MatSelectChange} from '@angular/material';
import { AppDateAdapter } from 'src/app/shared/date-adapter';
import { HttpClient } from '@angular/common/http';
import { usdaKey } from 'src/environments/environment.prod';
import axios from 'axios';

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

  // @Output() selectionChange: EventEmitter<MatSelectChange>;

  maxDate: Date;
  minValue = 0;
  today = new Date();
  branded = false;
  requireAllWords = false;
  totalHits: number;
  currentPage: number;
  totalPages: number;
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
  proxyURL = 'https://cors-anywhere.herokuapp.com/';
  usdaFoodSearchURL = 'https://api.nal.usda.gov/fdc/v1/search?api_key=';
  usdaFoodDetailsURL1 = 'https://api.nal.usda.gov/fdc/v1/';
  usdaFoodDetailsURL2 = '?api_key=';

  panelOpenState = false;
  usdaFoodItems = [] as any;
  usdaPickedFoodItem: FoodItem;
  usdaFoodItemDetailPaneOpen = false;
  usdaFoodItemDescription: string;
  usdaFoodItemDetail = [] as any;
  isLoadingFoodItems = false;
  isLoadingFoodItem = false;
  usdaSearchResults = false;
  defaultPage = 1;

  constructor(public foodService: FoodService,
              private http: HttpClient) { }

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

  // axios request
  onPick(foodDetailID: number) {
    this.usdaFoodItemDetailPaneOpen = false;
    this.isLoadingFoodItem = true;
    this.usdaPickedFoodItem = {} as FoodItem;
    axios.get(this.proxyURL + this.usdaFoodDetailsURL1 + foodDetailID + this.usdaFoodDetailsURL2 + usdaKey).then(response => {
      this.usdaFoodItemDetail = response.data.foodNutrients;
      this.usdaPickedFoodItem = {
        name: response.data.description,
        serving: 100,
        caloriesIn: this.usdaFoodItemDetail.filter(item => item.nutrient.id === 1008)[0].amount,
        protein: this.usdaFoodItemDetail.filter(item => item.nutrient.id === 1003)[0].amount,
        fat: this.usdaFoodItemDetail.filter(item => item.nutrient.id === 1004)[0].amount,
        carb: this.usdaFoodItemDetail.filter(item => item.nutrient.id === 1005)[0].amount
      };
      this.usdaFoodItemDetailPaneOpen = true;
      this.isLoadingFoodItem = false;
    });
  }

  onSearch(searchString: string, branded, allWords, page) {
    this.isLoadingFoodItems = true;
    axios.post(this.proxyURL + this.usdaFoodSearchURL + usdaKey,
        {
          generalSearchInput: searchString,
          includeDataTypes: {
            'Survey (FNDDS)': true,
            'Foundation': true,
            'Branded': branded
          },
          requireAllWords: allWords,
          pageNumber: typeof page === 'undefined' ? 1 : page
        }
      )
      .then(response => {
        this.usdaFoodItems = response.data.foods;
        this.totalHits = response.data.totalHits;
        this.currentPage = response.data.currentPage;
        this.totalPages = response.data.totalPages;
        this.isLoadingFoodItems = false;
        this.usdaSearchResults = true;
      })
      .catch(err => {
        console.log(err, err.response);
      });
  }

  onSelectionChanged(event) {
    console.log(event.target.value);
  }

  ngOnDestroy() {
    if (this.fbAvailableFoodItemsSubs) {
      this.fbAvailableFoodItemsSubs.forEach(sub => sub.unsubscribe());
    }
  }

}

    // classic XML request

    // sendHttpRequest = (method, url, data) => {
    //   const promise = new Promise((resolve, reject) => {
    //     const xhr = new XMLHttpRequest();
    //     xhr.open(method, url);
    //     xhr.responseType = 'json';
    //     if (data) {
    //       xhr.setRequestHeader('Content-Type', 'application/json');
    //     }
    //     xhr.onload = () => {;
    //       if (xhr.status >= 400) {
    //         reject(xhr.response);
    //       } else {
    //         resolve(xhr.response);
    //       }
    //     };
    //     xhr.onerror = () => {
    //       reject('Something went wrong!');
    //     };
    //     xhr.send(JSON.stringify(data));
    //   });
    //   return promise;
    // }

    // onSearch(searchString: string) {
    //   this.sendHttpRequest('POST', 'https://api.nal.usda.gov/fdc/v1/search?api_key=' + usdaKey,
    //   {
    //     generalSearchInput: searchString,
    //     includeDataTypes: {
    //       'Survey (FNDDS)': true,
    //       'Foundation': true,
    //       'Branded': true
    //     },
    //     requireAllWords: true,
    //     pageNumber: 1
    //   })
    //   .then(responseData => {
    //     console.log(responseData);
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
    // }

    // fetch request

    // sendHttpRequest = (methodRequest, url, data) => {
    //   return fetch(url, {
    //     method: methodRequest, // default is GET
    //     body: JSON.stringify(data),
    //     headers: data ? { 'Content-Type': 'application/json' } : {}
    //   }).then(response => {
    //     if (response.status >= 400) {
    //       // !response.ok
    //       return response.json().then(errResData => {
    //         const error = new Error('Something went wrong!');
    //         error.message = errResData;
    //         throw error;
    //       });
    //     }
    //     return response.json();
    //   });
    // }

    // onSearch(searchString: string) {
    //   this.sendHttpRequest('POST', 'https://api.nal.usda.gov/fdc/v1/search?api_key=' + usdaKey,
    //   {
    //     generalSearchInput: searchString,
    //     includeDataTypes: {
    //       'Survey (FNDDS)': true,
    //       'Foundation': true,
    //       'Branded': true
    //     },
    //     requireAllWords: true,
    //     pageNumber: 1
    //   })
    //   .then(responseData => {
    //     console.log(responseData);
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
    // }

