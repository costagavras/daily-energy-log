import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ProfileService {

openActivityLevel = new Subject<boolean>();

  constructor(private db: AngularFirestore) {}


  linkToActivityLevel() {
    this.openActivityLevel.next(true);
  }

}
