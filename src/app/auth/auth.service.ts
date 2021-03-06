import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

import { AuthData } from './auth-data.model';

import { TrainingService } from '../training/training.service';
import { UIService } from '../shared/ui.service';
import { FoodService } from '../food-intake/food.service';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class AuthService {
    authChange = new Subject<boolean>();
    private isAuthenticated = false;

    constructor(private router: Router,
                private afAuth: AngularFireAuth,
                private trainingService: TrainingService,
                private foodService: FoodService,
                private uiService: UIService,
                private profileService: ProfileService) {}

      // fired in app.component.ts
    initAuthListener() {
      this.afAuth.authState.subscribe(user => {
        if (user) {
          this.isAuthenticated = true;
          // true bc boolean payload (true = registered user), listened to in #header and #navigation to show contextual menu
          this.authChange.next(true);
          this.profileService.getUserData();
          this.router.navigate(['/']);
        } else {
          this.trainingService.cancelSubscriptions();
          this.foodService.cancelSubscriptions();
          this.profileService.cancelSubscriptions();
          // false bc boolean payload (false = unregistered user), listened to in #header and #navigation to show contextual menu
          this.authChange.next(false);
          this.router.navigate(['/signup']);
          this.isAuthenticated = false;
        }
      });
    }

    registerUser(authData: AuthData) {
        this.uiService.loadingStateChanged.next(true);
        this.afAuth.auth.createUserWithEmailAndPassword(
          authData.email,
          authData.password
        ).then(result => {
          this.uiService.loadingStateChanged.next(false);
        }).
          catch(error => {
            this.uiService.loadingStateChanged.next(false);
            this.uiService.showSnackbar(error.message, null, 3000);
        });
    }

    login(authData: AuthData) {
      this.uiService.loadingStateChanged.next(true);
      this.afAuth.auth.signInWithEmailAndPassword(
        authData.email,
        authData.password
        ).then(result => {
          this.uiService.loadingStateChanged.next(false);
      }).
        catch(error => {
          this.uiService.loadingStateChanged.next(false);
          this.uiService.showSnackbar(error.message, null, 3000);
      });
    }

    logout() {
      this.afAuth.auth.signOut();
    }

    isAuth() {
        return this.isAuthenticated;
    }

}
