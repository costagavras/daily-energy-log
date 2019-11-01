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

  constructor(private profileService: ProfileService) { }

  ngOnInit() {
    this.homeSubs.push(this.profileService.userProfileData.subscribe((userProfile: User) => {
        if (typeof userProfile !== 'undefined' && typeof userProfile.activityLevel !== 'undefined') {
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
