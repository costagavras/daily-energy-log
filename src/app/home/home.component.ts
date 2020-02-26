import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProfileService } from '../profile/profile.service';
import { Subscription } from 'rxjs';
import { User } from '../auth/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  profileFinished = true; // logic with false will hide the window after a split second, bad user experience;
  private homeSubs: Subscription[] = [];

  constructor(public profileService: ProfileService) { }

  ngOnInit() {
    this.homeSubs.push(this.profileService.userProfileData
      .subscribe((user: User) => {
        if (!(typeof user !== 'undefined' && typeof user.activityLevel !== 'undefined')) {
          this.profileFinished = false;
        }
    }));

    // triggering the event emitter in the service to get new UserData to which to subscribe to
    // once async firebaseUser is retrieved on subsequent (not first) runs of ngOnInit (returning to homepage);
    if (this.profileService.getFirebaseUser()) {
      this.profileService.getUserData();
    }
  }

  ngOnDestroy() {
    if (this.homeSubs) {
      this.homeSubs.forEach(sub => sub.unsubscribe());
    }
  }


}
