import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';
import { ProfileService } from 'src/app/profile/profile.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit, OnDestroy {
  @Output() closeSidenav = new EventEmitter<void>();
  isAuth = false;
  profileFinished = false;
  private sidenavSubs: Subscription[] = [];

  constructor(private authService: AuthService,
              private profileService: ProfileService) { }

  ngOnInit() {
    this.sidenavSubs.push(this.authService.authChange.subscribe(authStatus => {
      this.isAuth = authStatus;
    }));
    this.sidenavSubs.push(this.profileService.userProfileData.subscribe(userProfile => {
      if (typeof userProfile !== 'undefined' && typeof userProfile.activityLevel !== 'undefined') {
        this.profileFinished = true;
      } else {
        this.profileFinished = false;
      }
    }));
  }

  onClose() {
    this.closeSidenav.emit();
  }

  onLogout() {
    this.onClose();
    this.authService.logout();
  }

  ngOnDestroy() {
    if (this.sidenavSubs) {
      this.sidenavSubs.forEach(sub => sub.unsubscribe());
    }
  }
}
