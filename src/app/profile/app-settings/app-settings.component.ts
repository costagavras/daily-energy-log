import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';
import { ProfileService } from '../profile.service';
import { MatRadioChange } from '@angular/material';

@Component({
  selector: 'app-app-settings',
  templateUrl: './app-settings.component.html',
  styleUrls: ['./app-settings.component.css']
})
export class AppSettingsComponent implements OnInit, OnDestroy {
  @Output() tabSelected = new EventEmitter<void>();
  // tslint:disable-next-line: no-output-native
  @Output() change: EventEmitter<MatRadioChange>;

  unitsFormGroup: FormGroup;
  fbUser;
  userCreated: boolean;
  private appSettingSubs: Subscription[] = [];

  constructor(public profileService: ProfileService) { }

  ngOnInit() {

    this.fbUser = this.profileService.getFirebaseUser();

    // need it to activate event emitter in the service
    this.profileService.getUserData();

    this.appSettingSubs.push(this.profileService.userProfileData
      .subscribe(
        userProfileData => {
          this.unitsFormGroup.patchValue({units: typeof userProfileData.units !== 'undefined' ? userProfileData.units : 'metric' });
          this.profileService.unitsSelected(this.unitsFormGroup.value.units); // sends to UserData current state with no buttons touched
          typeof userProfileData !== 'undefined' ? this.userCreated = true : this.userCreated = false;
        }));

    this.unitsFormGroup = new FormGroup ({
      units: new FormControl('', {validators: [Validators.required]})
    });
  }

  tabSelect() {
    this.tabSelected.emit();
    this.profileService.unitsSelected(this.unitsFormGroup.value.units); // if save button is clicked
    if (this.userCreated) {
      this.profileService.addOrUpdateUser({
        units: this.unitsFormGroup.value.units,
        userId: this.fbUser.uid
      });
    }
  }

  unitChange($event: MatRadioChange) {
    this.profileService.unitsSelected($event.value); // if radio button is clicked
  }

  ngOnDestroy() {
    if (this.appSettingSubs) {
      this.appSettingSubs.forEach(sub => sub.unsubscribe());
    }
  }

}
