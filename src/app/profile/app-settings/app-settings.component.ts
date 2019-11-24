import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Subscription, Subject } from 'rxjs';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-app-settings',
  templateUrl: './app-settings.component.html',
  styleUrls: ['./app-settings.component.css']
})
export class AppSettingsComponent implements OnInit, OnDestroy {
  @Output() tabSelected = new EventEmitter<void>();

  unitsFormGroup: FormGroup;
  fbUser;
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
        }));

    this.unitsFormGroup = new FormGroup ({
      units: new FormControl('', {validators: [Validators.required]})
    });
  }

  tabSelect() {
    this.tabSelected.emit();
    this.profileService.unitsSelected(this.unitsFormGroup.value.units);

  }

  ngOnDestroy() {
    if (this.appSettingSubs) {
      this.appSettingSubs.forEach(sub => sub.unsubscribe());
    }
  }

}
