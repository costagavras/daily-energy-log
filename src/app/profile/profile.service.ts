import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '.././auth/user.model';

import { Subject, Subscription } from 'rxjs';
import { UIService } from '../shared/ui.service';

@Injectable()
export class ProfileService {

openActivityLevel = new Subject<boolean>();
userProfileData = new Subject<User>();
activitiesList = new Subject<any>();
private fbAvailableUserProfileItemsSubs: Subscription[] = [];

  constructor(private db: AngularFirestore,
              private uiService: UIService) {}

  getUserData(fbUserId) {
    this.fbAvailableUserProfileItemsSubs.push(
      this.db.collection('users').doc(fbUserId).valueChanges()
      .subscribe((userData: User) => {
        this.userProfileData.next(userData); // event emitter via Subject
    }, error => {
      this.uiService.showSnackbar('Fetching food items failed, please try again later', null, 3000);
    }));
  }

  getActivitiesList() {
    this.fbAvailableUserProfileItemsSubs.push(
      this.db.collection('activityLevelActivities').doc('list').valueChanges()
      .subscribe(actList => {
        this.activitiesList.next(actList);
        // this.activitiesList.next(this.snapshotToArray(actList));
    }));
  }

  // hack to extract keys from firebase array
  snapshotToArray = snapshot =>
    Object.entries(snapshot).map(e => Object.assign(e[1], { key: e[0] }))

  linkToActivityLevel() {
    this.openActivityLevel.next(true);
  }

  calcBMI(weight, height) {
    return Math.round((weight / (height * height)) * 10) / 10;
  }

  calcBMR(gender, age, weight, height) {
    // Mifflin St Jeor
    return Math.round(10 * weight + 6.25 * height - 5 * age + (gender === 'female' ? - 161 : + 5) );
  }

  addOrUpdateUser(userData: User) {
    this.fbAvailableUserProfileItemsSubs.push(this.db.collection('users').doc(userData.userId).snapshotChanges() // check if doc exists
      .subscribe(doc => {
        if (doc.payload.exists) {
          this.db.collection('users').doc(userData.userId).update(userData);
        } else {
          this.db.collection('users').doc(userData.userId).set(userData);
        }
    }));
  }

  cancelSubscriptions() {
    if (this.fbAvailableUserProfileItemsSubs) {
      this.fbAvailableUserProfileItemsSubs.forEach(sub => sub.unsubscribe());
    }
  }

}
