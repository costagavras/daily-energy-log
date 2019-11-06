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
    const prFinished = this.profileService.getUserData2();
    if (typeof prFinished !== 'undefined' && typeof prFinished.activityLevel !== 'undefined') {
      this.profileFinished = true;
    } else {
      this.profileFinished = false;
    }
  // if (typeof prFinished === 'undefined') {
  //   this.profileFinished = false;
  // } else if (typeof prFinished.activityLevel === 'undefined') {
  //   this.profileFinished = false;
  // } else {
  //   this.profileFinished = true;
  // }
  }

  ngOnDestroy() {
    if (this.homeSubs) {
      this.homeSubs.forEach(sub => sub.unsubscribe());
    }
  }


}
