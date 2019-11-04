import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User, UserStamp } from '.././auth/user.model';
import * as firebase from 'firebase/app';


import { Subject, Subscription } from 'rxjs';
import { UIService } from '../shared/ui.service';
import { Router } from '@angular/router';

@Injectable()
export class ProfileService {

openActivityLevel = new Subject<boolean>();
userProfileData = new Subject<User>();
activitiesList = new Subject<any>();
userStampsCollection = new Subject<UserStamp[]>();
userProfile: User;
fbUser;

private profileServiceSubs: Subscription[] = [];

  constructor(private db: AngularFirestore,
              private router: Router,
              private uiService: UIService) {}

  getUserData() {
    this.fbUser = firebase.auth().currentUser;
    this.profileServiceSubs.push(
      this.db.collection('users').doc(this.fbUser.uid).valueChanges()
      .subscribe((userData: User) => {
        this.userProfileData.next(userData); // event emitter via Subject
        this.userProfile = userData;
      }, error => {
        this.uiService.showSnackbar('Fetching user info failed, please try again later', null, 3000);
    }));
    return this.userProfile;
  }

  getUserStampData() {
    const userFirebaseId = this.getFirebaseUser().uid;
    this.profileServiceSubs.push(
      this.db.collection('users/' + userFirebaseId + '/userStamp').valueChanges()
      .subscribe((userStamps: UserStamp[]) => {
        this.userStampsCollection.next(userStamps);
      }, error => {
        this.uiService.showSnackbar('Fetching user info failed, please try again later', null, 3000);
      }
    ));
  }

  getFirebaseUser() {
    return firebase.auth().currentUser;
  }

  // getUserData2() {
  //   this.fbUser = firebase.auth().currentUser;
  //   const userRef = this.db.collection('users').doc(this.fbUser.uid);
  //   userRef.get().toPromise()
  //     .then(doc => {
  //       if (!doc.exists) {
  //         console.log('No such document!');
  //         this.userProfile = null;
  //       } else {
  //         this.userProfile = doc.data();
  //         this.userProfileData.next(doc.data());
  //       }
  //     })
  //     .catch(err => {
  //       console.log('Error getting document', err);
  //     });
  //   return this.userProfile;
  // }

  getActivitiesList() {
    this.profileServiceSubs.push(
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
    this.profileServiceSubs.push(this.db.collection('users').doc(userData.userId).snapshotChanges() // check if doc exists
      .subscribe(doc => {
        if (doc.payload.exists) {
          this.db.collection('users').doc(userData.userId).update(userData);
          this.uiService.showSnackbar(userData.name + ' successfully updated', null, 3000);
        } else {
          this.db.collection('users').doc(userData.userId).set(userData);
          this.uiService.showSnackbar(userData.name + ' was successfully created', null, 3000);
        }
    }));
  }

  deleteUser(user: User) {
    this.db.collection('users').doc(user.userId).delete();
    this.router.navigate(['/']);
    this.uiService.showSnackbar(user.name + ' is now gone!', null, 3000);
  }

  cancelSubscriptions() {
    if (this.profileServiceSubs) {
      this.profileServiceSubs.forEach(sub => sub.unsubscribe());
    }
  }

}
