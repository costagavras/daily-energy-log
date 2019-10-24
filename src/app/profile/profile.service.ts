import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '.././auth/user.model';

import { Subject } from 'rxjs';;

@Injectable()
export class ProfileService {

openActivityLevel = new Subject<boolean>();

  constructor(private db: AngularFirestore) {}


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

    this.db.collection('users').doc(userData.userId).snapshotChanges() // check if doc exists
      .subscribe(doc => {
        if (doc.payload.exists) {
          this.db.collection('users').doc(userData.userId).update(userData);
        } else {
          this.db.collection('users').doc(userData.userId).set(userData);
        }
    });
  }

}
