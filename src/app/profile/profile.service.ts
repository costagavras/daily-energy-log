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
unitsUserSelected = new Subject<string>();
userStampsCollection = new Subject<UserStamp[]>();
userProfile: User;
fbUser;
units: string;

private profileServiceSubs: Subscription[] = [];
private userExistsSub: Subscription;

  constructor(private db: AngularFirestore,
              private router: Router,
              private uiService: UIService) {}

  unitsSelected(units) {
    this.unitsUserSelected.next(units); // event emitter measurement units selected by user
  }

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

  getUserData2() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const userRef = this.db.collection('users').doc(user.uid);
        userRef.get().toPromise()
          .then(doc => {
            if (doc.exists) {
              this.userProfile = doc.data();
              this.userProfileData.next(this.userProfile);
            }
          })
          .catch(err => {
            console.log('Error getting document', err);
          });
        }
      });
    return this.userProfile;
  }

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
    this.userExistsSub = this.db.collection('users').doc(userData.userId).snapshotChanges()
      .subscribe(doc => {
        if (doc.payload.exists) {
          this.db.collection('users').doc(userData.userId).update(userData);
          this.uiService.showSnackbar(doc.payload.data()['name'] + ' successfully updated', null, 3000);
          this.userExistsSub.unsubscribe();
        } else {
          this.db.collection('users').doc(userData.userId).set(userData);
          this.uiService.showSnackbar(userData.name + ' was successfully created', null, 3000);
          this.userExistsSub.unsubscribe();
        }
    });
  }

  deleteProfile(user: User) {
    const collectionExRef = this.db.collection('users').doc(user.userId).collection('finishedExercises').ref;
    this.deleteCollection(this.db, collectionExRef, 100);

    const collectionFoodRef = this.db.collection('users').doc(user.userId).collection('finishedFoodItems').ref;
    this.deleteCollection(this.db, collectionFoodRef, 100);

    const collectionStampRef = this.db.collection('users').doc(user.userId).collection('userStamp').ref;
    this.deleteCollection(this.db, collectionStampRef, 100);

    this.db.collection('users').doc(user.userId).delete()
          .then(() => {
            this.router.navigate(['/']);
            this.uiService.showSnackbar(user.name + ' is now gone!', null, 3000);
          }).catch(error => {
            console.log(error);
          });
  }

  deleteUserAccount() {
    this.fbUser = firebase.auth().currentUser;
    if (this.fbUser) {
      this.fbUser.delete()
      .then(() => {
        this.uiService.showSnackbar('This account is now gone too!', null, 3000);
        // this.router.navigate(['/signup']);
    }).catch(error => {
      console.log(error);
    });
    }
  }

  deleteCollection(db, collectionRef, batchSize) {
    const query = collectionRef.limit(batchSize);

    return new Promise((resolve, reject) => {
        this.deleteQueryBatch(db, query, batchSize, resolve, reject);
    });
  }

  deleteQueryBatch(db, query, batchSize, resolve, reject) {
    query.get()
        .then((snapshot) => {
            // When there are no documents left, we are done
            if (snapshot.size === 0) {
                return 0;
            }

            // Delete documents in a batch
            const batch = firebase.firestore().batch();
            snapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
            });

            return batch.commit().then(() => {
                return snapshot.size;
            });
        }).then((numDeleted) => {
        if (numDeleted === 0) {
            resolve();
            return;
        }

        // Replacing Recurse on the next process tick, to avoid exploding the stack.
        setTimeout(() => {
            this.deleteQueryBatch(db, query, batchSize, resolve, reject);
        }, 0);
    })
        .catch(reject);
  }

  cancelSubscriptions() {
    if (this.profileServiceSubs) {
      this.profileServiceSubs.forEach(sub => sub.unsubscribe());
    }
  }

}
