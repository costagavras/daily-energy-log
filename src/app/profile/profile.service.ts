import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '.././auth/user.model';
import * as firebase from 'firebase/app';


import { Subject, Subscription } from 'rxjs';
import { UIService } from '../shared/ui.service';

@Injectable()
export class ProfileService {

openActivityLevel = new Subject<boolean>();
userProfileData = new Subject<User>();
activitiesList = new Subject<any>();
userProfile: User;
fbUser;

private fbAvailableUserProfileItemsSubs: Subscription[] = [];

  constructor(private db: AngularFirestore,
              private uiService: UIService) {}

  getUserData() {
    this.fbUser = firebase.auth().currentUser;
    this.fbAvailableUserProfileItemsSubs.push(
      this.db.collection('users').doc(this.fbUser.uid).valueChanges()
      .subscribe((userData: User) => {
        this.userProfileData.next(userData); // event emitter via Subject
        this.userProfile = userData;
      }, error => {
        this.uiService.showSnackbar('Fetching food items failed, please try again later', null, 3000);
    }));
    return this.userProfile;
  }

  getActivitiesList() {
    this.fbAvailableUserProfileItemsSubs.push(
      this.db.collection('activityLevelActivities').doc('list').valueChanges()
      .subscribe(actList => {
        this.activitiesList.next(actList);
    }));
  }

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

  calcRMR(actList, actHours) {
    let i = 0;
    let totalActivityHoursFiltered = 0;
    let totalActivitiesHoursProduct = 0;
    for (const [activity, pal] of Object.entries(actList)) {
      if (activity !== 'exercising (tracked here)' && activity !== 'walking (tracked here)' && actHours[i] !== 0) {
        const activityHours = actHours[i]; // hours assigned by user to this activity
        totalActivityHoursFiltered += activityHours;
        totalActivitiesHoursProduct = totalActivitiesHoursProduct + (+pal * activityHours);
      }
      i++;
    }
    const coefficientRMR = Math.round((totalActivitiesHoursProduct / totalActivityHoursFiltered) * 100) / 100;
    this.addOrUpdateUser({ ...this.getUserData(), activityLevel: coefficientRMR });
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
