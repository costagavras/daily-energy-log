import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ProfileService } from '../profile.service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/auth/user.model';

@Component({
  selector: 'app-profile-completed',
  templateUrl: './profile-completed.component.html',
  styleUrls: ['./profile-completed.component.css']
})
export class ProfileCompletedComponent implements OnInit, OnDestroy {
@Output() tabSelected = new EventEmitter<void>();

private profileSubs: Subscription[] = [];
fbUser;
userData: User;
dataLoaded = false;

  constructor(public profileService: ProfileService) { }

  ngOnInit() {
    this.fbUser = this.profileService.getFirebaseUser();
    this.profileService.getUserData();

    this.profileSubs.push(this.profileService.userProfileData
      .subscribe(
        userProfileData => {
      this.userData = userProfileData;
      this.dataLoaded = true;
    }));
  }

  tabSelect() {
    this.tabSelected.emit();
  }

  ngOnDestroy() {
    if (this.profileSubs) {
      this.profileSubs.forEach(sub => sub.unsubscribe());
    }
  }

}
