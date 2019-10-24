import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDatepickerInputEvent } from '@angular/material';

import { Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { FoodItem } from './food-item.model';
import { UIService } from 'src/app/shared/ui.service';

@Injectable()
export class FoodService {
  foodItemsBeveragesChanged = new Subject<FoodItem[]>();
  foodItemsDairyChanged = new Subject<FoodItem[]>();
  foodItemsDessertsChanged = new Subject<FoodItem[]>();
  foodItemsDishesChanged = new Subject<FoodItem[]>();
  foodItemsFatsChanged = new Subject<FoodItem[]>();
  foodItemsFishChanged = new Subject<FoodItem[]>();
  foodItemsFruitsChanged = new Subject<FoodItem[]>();
  foodItemsGrainsChanged = new Subject<FoodItem[]>();
  foodItemsMeatChanged = new Subject<FoodItem[]>();
  foodItemsVegetablesChanged = new Subject<FoodItem[]>();

  finishedFoodItemChanged = new Subject<FoodItem[]>();
  dateFilter = new Subject<Date>();

  private availableFoodItemsStorage = {} as any;

  private chosenFoodItem: FoodItem;
  private fbAvailableFoodItemsSubs: Subscription[] = [];

  constructor(private db: AngularFirestore,
              private uiService: UIService) {}

  fetchAvailableFoodItemsBeverages() {
    this.fbAvailableFoodItemsSubs.push(this.db.collection('availableFoodItemsBeverages').snapshotChanges()
      .pipe(map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            ...doc.payload.doc.data()
          } as FoodItem;
        });
      }))
      .subscribe((foodItems: FoodItem[]) => {
        this.availableFoodItemsStorage['beverages'] = foodItems;
        this.foodItemsBeveragesChanged.next([...this.availableFoodItemsStorage['beverages']]);
      }, error => {
        this.uiService.showSnackbar('Fetching food items failed, please try again later', null, 3000);
      }));
  }

  fetchAvailableFoodItemsDairy() {
    this.fbAvailableFoodItemsSubs.push(this.db.collection('availableFoodItemsDairy').snapshotChanges()
      .pipe(map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            ...doc.payload.doc.data()
          } as FoodItem;
        });
      }))
      .subscribe((foodItems: FoodItem[]) => {
        this.availableFoodItemsStorage['dairy'] = foodItems;
        this.foodItemsDairyChanged.next([...this.availableFoodItemsStorage['dairy']]);
      }, error => {
        this.uiService.showSnackbar('Fetching food items failed, please try again later', null, 3000);
      }));
  }

  fetchAvailableFoodItemsDesserts() {
    this.fbAvailableFoodItemsSubs.push(this.db.collection('availableFoodItemsDesserts').snapshotChanges()
      .pipe(map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            ...doc.payload.doc.data()
          } as FoodItem;
        });
      }))
      .subscribe((foodItems: FoodItem[]) => {
        this.availableFoodItemsStorage['desserts'] = foodItems;
        this.foodItemsDessertsChanged.next([...this.availableFoodItemsStorage['desserts']]);
      }, error => {
        this.uiService.showSnackbar('Fetching food items failed, please try again later', null, 3000);
      }));
  }

  fetchAvailableFoodItemsDishes() {
    this.fbAvailableFoodItemsSubs.push(this.db.collection('availableFoodItemsDishes').snapshotChanges()
      .pipe(map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            ...doc.payload.doc.data()
          } as FoodItem;
        });
      }))
      .subscribe((foodItems: FoodItem[]) => {
        this.availableFoodItemsStorage['dishes'] = foodItems;
        this.foodItemsDishesChanged.next([...this.availableFoodItemsStorage['dishes']]);
      }, error => {
        this.uiService.showSnackbar('Fetching food items failed, please try again later', null, 3000);
      }));
  }

  fetchAvailableFoodItemsFats() {
    this.fbAvailableFoodItemsSubs.push(this.db.collection('availableFoodItemsFats').snapshotChanges()
      .pipe(map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            ...doc.payload.doc.data()
          } as FoodItem;
        });
      }))
      .subscribe((foodItems: FoodItem[]) => {
        this.availableFoodItemsStorage['fats'] = foodItems;
        this.foodItemsFatsChanged.next([...this.availableFoodItemsStorage['fats']]);
      }, error => {
        this.uiService.showSnackbar('Fetching food items failed, please try again later', null, 3000);
      }));
  }

  fetchAvailableFoodItemsFish() {
    this.fbAvailableFoodItemsSubs.push(this.db.collection('availableFoodItemsFish').snapshotChanges()
      .pipe(map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            ...doc.payload.doc.data()
          } as FoodItem;
        });
      }))
      .subscribe((foodItems: FoodItem[]) => {
        this.availableFoodItemsStorage['fish'] = foodItems;
        this.foodItemsFishChanged.next([...this.availableFoodItemsStorage['fish']]);
      }, error => {
        this.uiService.showSnackbar('Fetching food items failed, please try again later', null, 3000);
      }));
  }

  fetchAvailableFoodItemsFruits() {
    this.fbAvailableFoodItemsSubs.push(this.db.collection('availableFoodItemsFruits').snapshotChanges()
      .pipe(map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            ...doc.payload.doc.data()
          } as FoodItem;
        });
      }))
      .subscribe((foodItems: FoodItem[]) => {
        this.availableFoodItemsStorage['fruits'] = foodItems;
        this.foodItemsFruitsChanged.next([...this.availableFoodItemsStorage['fruits']]);
      }, error => {
        this.uiService.showSnackbar('Fetching food items failed, please try again later', null, 3000);
      }));
  }

  fetchAvailableFoodItemsGrains() {
    this.fbAvailableFoodItemsSubs.push(this.db.collection('availableFoodItemsGrains').snapshotChanges()
      .pipe(map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            ...doc.payload.doc.data()
          } as FoodItem;
        });
      }))
      .subscribe((foodItems: FoodItem[]) => {
        this.availableFoodItemsStorage['grains'] = foodItems;
        this.foodItemsGrainsChanged.next([...this.availableFoodItemsStorage['grains']]);
      }, error => {
        this.uiService.showSnackbar('Fetching food items failed, please try again later', null, 3000);
      }));
  }

  fetchAvailableFoodItemsMeat() {
    this.fbAvailableFoodItemsSubs.push(this.db.collection('availableFoodItemsMeat').snapshotChanges()
      .pipe(map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            ...doc.payload.doc.data()
          } as FoodItem;
        });
      }))
      .subscribe((foodItems: FoodItem[]) => {
        this.availableFoodItemsStorage['meat'] = foodItems;
        this.foodItemsMeatChanged.next([...this.availableFoodItemsStorage['meat']]);
      }, error => {
        this.uiService.showSnackbar('Fetching food items failed, please try again later', null, 3000);
      }));
  }

  fetchAvailableFoodItemsVegetables() {
    this.fbAvailableFoodItemsSubs.push(this.db.collection('availableFoodItemsVegetables').snapshotChanges()
      .pipe(map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            ...doc.payload.doc.data()
          } as FoodItem;
        });
      }))
      .subscribe((foodItems: FoodItem[]) => {
        this.availableFoodItemsStorage['vegetables'] = foodItems;
        this.foodItemsVegetablesChanged.next([...this.availableFoodItemsStorage['vegetables']]);
      }, error => {
        this.uiService.showSnackbar('Fetching food items failed, please try again later', null, 3000);
      }));
  }

  saveFoodItem(foodDate: Date, selectedId: string, size: number, param: string) {
    this.chosenFoodItem = this.availableFoodItemsStorage[param].find(ex => ex.id === selectedId);
    this.addDataToDatabase({
      ...this.chosenFoodItem,
      serving: size,
      calories: Math.round(size / this.chosenFoodItem.serving * this.chosenFoodItem.calories),
      protein: Math.round(size / this.chosenFoodItem.serving * this.chosenFoodItem.protein),
      carbs: Math.round(size / this.chosenFoodItem.serving * this.chosenFoodItem.carbs),
      fat: Math.round(size / this.chosenFoodItem.serving * this.chosenFoodItem.fat),
      date: new Date(foodDate.setHours(12, 0, 0, 0))
    });
  }

  fetchCompletedFoodItems() {
    this.uiService.loadingStateChanged.next(true);
    this.fbAvailableFoodItemsSubs.push(this.db.collection<FoodItem>('finishedFoodItems', ref => ref.orderBy('date', 'desc')).valueChanges()
    .subscribe((foodItem: FoodItem[]) => {
      this.uiService.loadingStateChanged.next(false);
      this.finishedFoodItemChanged.next(foodItem);
    }, error => {
      this.uiService.loadingStateChanged.next(false);
      this.uiService.showSnackbar('Fetching food items failed, please try again later', null, 3000);
    }));
  }

  filterDate(event: MatDatepickerInputEvent<Date>) {
    this.dateFilter.next(event.value);
  }

  private addDataToDatabase(foodItem: FoodItem) {
    this.db.collection('finishedFoodItems').add(foodItem)
    .then(docRef => {
      this.db.collection('finishedFoodItems').doc(docRef.id).update({
        id: docRef.id
      });
    });
  }

  // called from the template
  private deleteDataFromDatabase(foodItem: FoodItem) {
    this.db.doc('finishedFoodItems/' + foodItem.id).delete();
  }

  cancelSubscriptions() {
    if (this.fbAvailableFoodItemsSubs) {
      this.fbAvailableFoodItemsSubs.forEach(sub => sub.unsubscribe());
    }
  }
}
