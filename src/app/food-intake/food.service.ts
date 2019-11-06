import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDatepickerInputEvent } from '@angular/material';

import { Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { FoodItem } from './food-item.model';
import { UIService } from 'src/app/shared/ui.service';
import { ProfileService } from '../profile/profile.service';
import { UserStamp, User } from '../auth/user.model';

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

  finishedFoodItemsChanged = new Subject<FoodItem[]>();

  dateFilter = new Subject<Date>();

  userData: User;

  private availableFoodItemsStorage = {} as any;

  private chosenFoodItem: FoodItem;
  private foodServiceSubs: Subscription[] = [];

  constructor(private db: AngularFirestore,
              private uiService: UIService,
              private profileService: ProfileService) {}

  getUserInfo() {
    this.profileService.getUserData();
    return new Promise (resolve => {
      this.foodServiceSubs.push(this.profileService.userProfileData
        .subscribe((userData: User) => {
          this.userData = userData;
          resolve(this.userData);
      }));
    });
  }

  fetchAvailableFoodItemsBeverages() {
    this.foodServiceSubs.push(
      this.db.collection<FoodItem>('availableFoodItemsBeverages', ref => ref.orderBy('name', 'asc')).snapshotChanges()
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
    this.foodServiceSubs.push(
      this.db.collection<FoodItem>('availableFoodItemsDairy', ref => ref.orderBy('name', 'asc')).snapshotChanges()
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
    this.foodServiceSubs.push(
      this.db.collection<FoodItem>('availableFoodItemsDesserts', ref => ref.orderBy('name', 'asc')).snapshotChanges()
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
    this.foodServiceSubs.push(
      this.db.collection<FoodItem>('availableFoodItemsDishes', ref => ref.orderBy('name', 'asc')).snapshotChanges()
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
    this.foodServiceSubs.push(
      this.db.collection<FoodItem>('availableFoodItemsFats', ref => ref.orderBy('name', 'asc')).snapshotChanges()
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
    this.foodServiceSubs.push(
      this.db.collection<FoodItem>('availableFoodItemsFish', ref => ref.orderBy('name', 'asc')).snapshotChanges()
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
    this.foodServiceSubs.push(
      this.db.collection<FoodItem>('availableFoodItemsFruits', ref => ref.orderBy('name', 'asc')).snapshotChanges()
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
    this.foodServiceSubs.push(
      this.db.collection<FoodItem>('availableFoodItemsGrains', ref => ref.orderBy('name', 'asc')).snapshotChanges()
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
    this.foodServiceSubs.push(
      this.db.collection<FoodItem>('availableFoodItemsMeat', ref => ref.orderBy('name', 'asc')).snapshotChanges()
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
    this.foodServiceSubs.push(
      this.db.collection<FoodItem>('availableFoodItemsVegetables', ref => ref.orderBy('name', 'asc')).snapshotChanges()
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

  async saveFoodItem(foodDate: Date, selectedId: string, size: number, param: string) {
    this.chosenFoodItem = this.availableFoodItemsStorage[param].find(ex => ex.id === selectedId);
    await this.getUserInfo();
    this.addDataToDatabase({
      ...this.chosenFoodItem,
      serving: size,
      caloriesIn: Math.round(size / this.chosenFoodItem.serving * this.chosenFoodItem.caloriesIn),
      protein: Math.round(size / this.chosenFoodItem.serving * this.chosenFoodItem.protein),
      carb: Math.round(size / this.chosenFoodItem.serving * this.chosenFoodItem.carb),
      fat: Math.round(size / this.chosenFoodItem.serving * this.chosenFoodItem.fat),
      // dateStr: new Date(foodDate.setHours(12, 0, 0, 0)).toISOString().substring(0, 10).split('-').reverse().join('.'),
      dateStr: new Date(foodDate.setHours(12, 0, 0, 0)).toISOString().substring(0, 10),
      date: new Date(foodDate.setHours(12, 0, 0, 0))
    }, {
      date: new Date(foodDate.setHours(12, 0, 0, 0)),
      dateStr: new Date(foodDate.setHours(12, 0, 0, 0)).toISOString().substring(0, 10),
      age: this.userData.age,
      weight: this.userData.weight,
      bmi: this.userData.bmi,
      bmr: this.userData.bmr,
      activityLevel: this.userData.activityLevel
    });
  }

  fetchCompletedFoodItems() {
    this.uiService.loadingStateChanged.next(true);
    const userFirebaseId = this.profileService.getFirebaseUser().uid;

    this.foodServiceSubs.push(
      this.db.collection<FoodItem>('users/' + userFirebaseId + '/finishedFoodItems', ref => ref.orderBy('date', 'desc')).valueChanges()
    .subscribe((foodItem: FoodItem[]) => {
      this.uiService.loadingStateChanged.next(false);
      this.finishedFoodItemsChanged.next(foodItem);
    }, error => {
      this.uiService.loadingStateChanged.next(false);
      this.uiService.showSnackbar('Fetching food items failed, please try again later', null, 3000);
    }));
  }

  filterDate(event: MatDatepickerInputEvent<Date>) {
    this.dateFilter.next(event.value);
  }

  private addDataToDatabase(foodItem: FoodItem, userStamp: UserStamp) {
    const userFirebaseId = this.profileService.getFirebaseUser().uid;
    this.db.collection('users').doc(userFirebaseId).collection('finishedFoodItems').add(foodItem)
    .then(docRef => {
      this.db.collection('users').doc(userFirebaseId).collection('finishedFoodItems').doc(docRef.id).update({
        id: docRef.id
      });
      // this.uiService.showSnackbar(foodItem.name + 'was successfully added', null, 3000);
    });
    this.db.collection('users').doc(userFirebaseId).collection('userStamp').doc(userStamp.dateStr).set(userStamp);
  }

  // called from the template
  private deleteDataFromDatabase(foodItem: FoodItem) {
    const userFirebaseId = this.profileService.getFirebaseUser().uid;
    this.db.collection('users').doc(userFirebaseId).collection('finishedFoodItems').doc(foodItem.id).delete();
    this.uiService.showSnackbar(foodItem.name + ' was successfully deleted', null, 3000);
  }

  cancelSubscriptions() {
    if (this.foodServiceSubs) {
      this.foodServiceSubs.forEach(sub => sub.unsubscribe());
    }
  }
}
