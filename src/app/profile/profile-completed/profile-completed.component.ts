import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';

import { ProfileService } from '../profile.service';
import { User } from 'src/app/auth/user.model';
import { DialogDeleteProfileComponent } from '../profile-completed/dialog-delete-profile.component';

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

  constructor(public profileService: ProfileService,
              private dialog: MatDialog,
              private router: Router) { }

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

  deleteUser(userToDelete) {
   const dialogRef = this.dialog.open(DialogDeleteProfileComponent, {
      data: {
        user: userToDelete
      }
    });
   this.profileSubs.push(dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.profileService.deleteProfile(userToDelete);
      }
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
