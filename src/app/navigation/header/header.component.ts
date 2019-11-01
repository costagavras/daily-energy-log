import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';
import { ProfileService } from 'src/app/profile/profile.service';
import { User } from '../../auth/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() sidenavToggle = new EventEmitter<void>();
  isAuth = false;
  profileFinished = false;
  userProfileData: User;
  private headerSubs: Subscription[] = [];

  constructor(private authService: AuthService,
              private profileService: ProfileService) { }

  ngOnInit()  {
    this.headerSubs.push(this.authService.authChange.subscribe(authStatus => {
      this.isAuth = authStatus;
    }));
    this.headerSubs.push(this.profileService.userProfileData.subscribe((userProfile: User) => {
      if (typeof userProfile !== 'undefined' && typeof userProfile.activityLevel !== 'undefined') {
            this.profileFinished = true;
            this.userProfileData = userProfile;
        } else {
          this.profileFinished = false;
        }
    }));
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    if (this.headerSubs) {
      this.headerSubs.forEach(sub => sub.unsubscribe());
    }
  }
}
