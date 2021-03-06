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
  foodItemsOtherChanged = new Subject<FoodItem[]>();
  customFoodItemsChanged = new Subject<FoodItem[]>();

  finishedFoodItemsChanged = new Subject<FoodItem[]>();

  dateFilter = new Subject<Date>();

  userData: User;
  oldAddedFoodName: string;
  userFoodItemsCollection: string;
  userFirebaseId: string;

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
    const userFoodItemsCollection = 'users/' + this.profileService.getFirebaseUser().uid + '/userFoodItems';
    this.foodServiceSubs.push(
      // this.db.collectionGroup<FoodItem>('userFoodItems', ref => ref.where('category', '==', 'Beverages'))
      this.db.collection<FoodItem>(userFoodItemsCollection, ref => ref.where('category', '==', 'beverages'))
      .snapshotChanges()
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
    const userFirebaseId = this.profileService.getFirebaseUser().uid;
    this.foodServiceSubs.push(
      this.db.collection<FoodItem>('users/' + userFirebaseId + '/userFoodItems', ref => ref.where('category', '==', 'dairy'))
      .snapshotChanges()
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
    const userFirebaseId = this.profileService.getFirebaseUser().uid;
    this.foodServiceSubs.push(
      this.db.collection<FoodItem>('users/' + userFirebaseId + '/userFoodItems', ref => ref.where('category', '==', 'desserts'))
      .snapshotChanges()
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
    const userFirebaseId = this.profileService.getFirebaseUser().uid;
    this.foodServiceSubs.push(
      this.db.collection<FoodItem>('users/' + userFirebaseId + '/userFoodItems', ref => ref.where('category', '==', 'dishes'))
      .snapshotChanges()
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
    const userFirebaseId = this.profileService.getFirebaseUser().uid;
    this.foodServiceSubs.push(
      this.db.collection<FoodItem>('users/' + userFirebaseId + '/userFoodItems', ref => ref.where('category', '==', 'fats'))
      .snapshotChanges()
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
    const userFirebaseId = this.profileService.getFirebaseUser().uid;
    this.foodServiceSubs.push(
      this.db.collection<FoodItem>('users/' + userFirebaseId + '/userFoodItems', ref => ref.where('category', '==', 'fish'))
      .snapshotChanges()
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
    const userFirebaseId = this.profileService.getFirebaseUser().uid;
    this.foodServiceSubs.push(
      this.db.collection<FoodItem>('users/' + userFirebaseId + '/userFoodItems', ref => ref.where('category', '==', 'fruits'))
      .snapshotChanges()
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
    const userFirebaseId = this.profileService.getFirebaseUser().uid;
    this.foodServiceSubs.push(
      this.db.collection<FoodItem>('users/' + userFirebaseId + '/userFoodItems', ref => ref.where('category', '==', 'grains'))
      .snapshotChanges()
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
    const userFirebaseId = this.profileService.getFirebaseUser().uid;
    this.foodServiceSubs.push(
      this.db.collection<FoodItem>('users/' + userFirebaseId + '/userFoodItems', ref => ref.where('category', '==', 'meat'))
      .snapshotChanges()
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
    const userFirebaseId = this.profileService.getFirebaseUser().uid;
    this.foodServiceSubs.push(
      // this.db.collection<FoodItem>('availableFoodItemsVegetables', ref => ref.orderBy('name', 'asc')).snapshotChanges()
      this.db.collection<FoodItem>('users/' + userFirebaseId + '/userFoodItems', ref => ref.where('category', '==', 'vegetables'))
      .snapshotChanges()
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

  fetchAvailableFoodItemsOther() {
    const userFirebaseId = this.profileService.getFirebaseUser().uid;
    this.foodServiceSubs.push(
      this.db.collection<FoodItem>('users/' + userFirebaseId + '/userFoodItems', ref => ref.where('category', '==', 'other'))
      .snapshotChanges()
      .pipe(map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            ...doc.payload.doc.data()
          } as FoodItem;
        });
      }))
      .subscribe((foodItems: FoodItem[]) => {
        this.availableFoodItemsStorage['other'] = foodItems;
        this.foodItemsOtherChanged.next([...this.availableFoodItemsStorage['other']]);
      }, error => {
        this.uiService.showSnackbar('Fetching food items failed, please try again later', null, 3000);
      }));
  }

  fetchCustomFoodItems() {
    const userFirebaseId = this.profileService.getFirebaseUser().uid;
    this.foodServiceSubs.push(
      this.db.collection<FoodItem>('users/' + userFirebaseId + '/userFoodItems').snapshotChanges()
      .pipe(map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            ...doc.payload.doc.data()
          } as FoodItem;
        });
      }))
      .subscribe((foodItems: FoodItem[]) => {
        this.customFoodItemsChanged.next(foodItems);
      }, error => {
        this.uiService.showSnackbar('Fetching food items failed, please try again later', null, 3000);
      }));
  }

  async saveFoodItem(foodDate: Date, name: string, size: number, param: string, usdaFoodItem: FoodItem) {
    if (param !== 'usda') {
      this.chosenFoodItem = this.availableFoodItemsStorage[param].find(ex => ex.name === name);
    } else {
      this.chosenFoodItem = usdaFoodItem;
    }
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
    },
    {
      date: new Date(foodDate.setHours(12, 0, 0, 0)),
      dateStr: new Date(foodDate.setHours(12, 0, 0, 0)).toISOString().substring(0, 10),
      age: this.userData.age,
      weight: this.userData.weight,
      bmi: this.userData.bmi,
      bmr: this.userData.bmr,
      activityLevel: this.userData.activityLevel
    });
  }

  saveCustomFood(foodItem: FoodItem, oldName?: string) {
    const userFirebaseId = this.profileService.getFirebaseUser().uid;
    // case Delete
    if (oldName && oldName === 'delete') {
      return this.db.collection('users').doc(userFirebaseId).collection('userFoodItems').doc(foodItem.name).delete()
      .then(() => {
        this.uiService.showSnackbar(foodItem.name + ' was successfully deleted', null, 3000);
        });
    }

    // case Update
    if (oldName && oldName !== 'delete') {
      return this.db.collection('users').doc(userFirebaseId).collection('userFoodItems').doc(oldName).delete()
        .then(() => {
          this.db.collection('users').doc(userFirebaseId).collection('userFoodItems').doc(foodItem.name).set(foodItem)
            .then(() => {
              this.uiService.showSnackbar(foodItem.name + ' was updated in the database', null, 3000);
              this.oldAddedFoodName = foodItem.name;
            });
        });
    }

    // case Add
    if (!oldName) {
      return this.db.collection('users').doc(userFirebaseId).collection('userFoodItems').doc(foodItem.name).set(foodItem)
      .then(() => {
        this.uiService.showSnackbar(foodItem.name + ' was added to the database', null, 3000);
      });
    }

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
      })
    );
  }

  // fetchCustomFoodItems() {
  //   this.uiService.loadingStateChanged.next(true);
  //   this.foodServiceSubs.push(
  //     this.db.collectionGroup<FoodItem>('userFoodItems').valueChanges()
  //       .subscribe((foodItem: FoodItem[]) => {
  //         this.uiService.loadingStateChanged.next(false);
  //         this.customFoodItemsChanged.next(foodItem);
  //   }, error => {
  //     this.uiService.loadingStateChanged.next(false);
  //     this.uiService.showSnackbar('Fetching food items failed, please try again later', null, 3000);
  //   })
  //   );
  // }

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
  deleteDataFromDatabase(foodItem: FoodItem) {
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
