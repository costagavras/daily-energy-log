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

  profileFinished = true;
  private homeSubs: Subscription[] = [];

  constructor(public profileService: ProfileService) { }

  ngOnInit() {
    // const prFinished = this.profileService.getUserData2();
    this.homeSubs.push(this.profileService.userProfileData
      .subscribe(user => {
        const prFinished = user;
        if (typeof prFinished !== 'undefined' && typeof prFinished.activityLevel !== 'undefined') {
          this.profileFinished = true;
        } else {
          this.profileFinished = false;
        }
    }));
  }

  ngOnDestroy() {
    if (this.homeSubs) {
      this.homeSubs.forEach(sub => sub.unsubscribe());
    }
  }


}
