import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { FoodService } from '../food.service';
import { FoodItem } from '../food-item.model';
import { Subscription } from 'rxjs';

import { MAT_DATE_FORMATS, DateAdapter } from '@angular/material';
import { AppDateAdapter } from '../../shared/date-adapter';
// import { HttpClient } from '@angular/common/http';
import { usdaKey } from '../../../environments/environment.prod';
import { environment } from '../../../environments/environment';


import { MatDialog } from '@angular/material';
import { DialogAddCategoryComponent } from '../new-food-intake/dialog-add-category.component';

import axios from 'axios';
import { ProfileService } from '../../profile/profile.service';

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

  @Input() expanded: any;

  maxDate: Date;
  minValue = 0;
  today = new Date();
  branded = false;
  requireAllWords = false;
  totalHits: number;
  currentPage: number;
  totalPages: number;
  defaultPage = 1;

  panelOpenState = false;
  usdaFoodItems = [] as any;
  usdaPickedFoodItem: FoodItem;
  usdaFoodItemDetailPaneOpen = false;
  usdaFoodItemDescription: string;
  usdaFoodItemDetail = [] as any;
  isLoadingFoodItems = false;
  isLoadingFoodItem = false;
  usdaSearchResults = false;
  units: string;
  usdaSearch: string;

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
  private newFoodIntakeSubs: Subscription[] = [];

  proxyURL = 'https://cors-anywhere.herokuapp.com/';
  usdaFoodSearchURL = 'https://api.nal.usda.gov/fdc/v1/search?api_key=';
  usdaFoodDetailsURL1 = 'https://api.nal.usda.gov/fdc/v1/';
  usdaFoodDetailsURL2 = '?api_key=';

  categoryTitle = 'Input food item and serving size (gr/oz)';
  foodCategories = ['beverages', 'dairy', 'desserts', 'dishes', 'fats', 'fish', 'fruits', 'grains',
  'meat', 'vegetables', 'other'];
  foodCategoriesObject = {} as any;


  constructor(public foodService: FoodService,
              private profileService: ProfileService,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.maxDate = new Date();

    this.profileService.getUserData();

    this.newFoodIntakeSubs.push(this.profileService.userProfileData
      .subscribe(
        user => (this.units = user.units)
      ));

    this.newFoodIntakeSubs.push(this.foodService.foodItemsBeveragesChanged
      .subscribe(
        foodItems => (this.foodCategoriesObject.beverages = foodItems)
        ));

    this.foodService.fetchAvailableFoodItemsBeverages();

    this.newFoodIntakeSubs.push(this.foodService.foodItemsDairyChanged
      .subscribe(
        foodItems => (this.foodCategoriesObject.dairy = foodItems)
      ));
    this.foodService.fetchAvailableFoodItemsDairy();

    this.newFoodIntakeSubs.push(this.foodService.foodItemsDessertsChanged
      .subscribe(
        foodItems => (this.foodCategoriesObject.desserts = foodItems)
      ));
    this.foodService.fetchAvailableFoodItemsDesserts();

    this.newFoodIntakeSubs.push(this.foodService.foodItemsDishesChanged
      .subscribe(
        foodItems => (this.foodCategoriesObject.dishes = foodItems)
      ));
    this.foodService.fetchAvailableFoodItemsDishes();

    this.newFoodIntakeSubs.push(this.foodService.foodItemsFatsChanged
      .subscribe(
        foodItems => (this.foodCategoriesObject.fats = foodItems)
      ));
    this.foodService.fetchAvailableFoodItemsFats();

    this.newFoodIntakeSubs.push(this.foodService.foodItemsFishChanged
      .subscribe(
        foodItems => (this.foodCategoriesObject.fish = foodItems)
      ));
    this.foodService.fetchAvailableFoodItemsFish();

    this.newFoodIntakeSubs.push(this.foodService.foodItemsFruitsChanged
      .subscribe(
        foodItems => (this.foodCategoriesObject.fruits = foodItems)
      ));
    this.foodService.fetchAvailableFoodItemsFruits();

    this.newFoodIntakeSubs.push(this.foodService.foodItemsGrainsChanged
      .subscribe(
        foodItems => (this.foodCategoriesObject.grains = foodItems)
      ));
    this.foodService.fetchAvailableFoodItemsGrains();

    this.newFoodIntakeSubs.push(this.foodService.foodItemsMeatChanged
      .subscribe(
        foodItems => (this.foodCategoriesObject.meat = foodItems)
      ));
    this.foodService.fetchAvailableFoodItemsMeat();

    this.newFoodIntakeSubs.push(this.foodService.foodItemsVegetablesChanged
      .subscribe(
        foodItems => (this.foodCategoriesObject.vegetables = foodItems)
      ));
    this.foodService.fetchAvailableFoodItemsVegetables();

    this.newFoodIntakeSubs.push(this.foodService.foodItemsOtherChanged
      .subscribe(
        foodItems => (this.foodCategoriesObject.other = foodItems)
      ));
    this.foodService.fetchAvailableFoodItemsOther();

  }

  // axios request
  onPick(foodDetailID: number) {
    this.usdaFoodItemDetailPaneOpen = false;
    this.isLoadingFoodItem = true;
    this.usdaPickedFoodItem = {} as FoodItem;
    if (environment.production) {
      this.proxyURL = '';
    }
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
    this.usdaSearch = searchString;
    if (environment.production) {
      this.proxyURL = '';
    }
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

  saveCustomFood(usdaPickedFoodItem: FoodItem) {
    const dialogRef = this.dialog.open(DialogAddCategoryComponent, {
       data: {
         foodCategories: this.foodCategories
       }
     });
    this.newFoodIntakeSubs.push(dialogRef.afterClosed().subscribe(pickedCategory => {
       if (pickedCategory) {
         usdaPickedFoodItem.category = pickedCategory;
         this.foodService.saveCustomFood(usdaPickedFoodItem);
       }
     }));
   }

  ngOnDestroy() {
    if (this.newFoodIntakeSubs) {
      this.newFoodIntakeSubs.forEach(sub => sub.unsubscribe());
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

