import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ProfileService } from '../profile.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-anthropometry',
  templateUrl: './anthropometry.component.html',
  styleUrls: ['./anthropometry.component.css']
})
export class AnthropometryComponent implements OnInit, OnDestroy {
  @Output() tabSelected = new EventEmitter<void>();

  minAgeValue = 10;
  minHeightValue = 100;
  minWeightValue = 20;
  bmi = 0;
  bmr = 0;
  nameFormGroup: FormGroup;
  genderFormGroup: FormGroup;
  ageFormGroup: FormGroup;
  weightFormGroup: FormGroup;
  heightFormGroup: FormGroup;
  loadLinkToActivityLevel = false;
  fbUser;
  private anthropometrySubs: Subscription[] = [];

  constructor(public profileService: ProfileService) {}

  ngOnInit() {

    this.fbUser = this.profileService.getFirebaseUser();

    // need it to activate event emitter in the service
    this.profileService.getUserData();

    this.anthropometrySubs.push(this.profileService.userProfileData
      .subscribe(
        userProfileData => {
          this.nameFormGroup.patchValue({name: typeof userProfileData !== 'undefined' ? userProfileData.name : null });
          this.genderFormGroup.patchValue({gender: typeof userProfileData !== 'undefined' ? userProfileData.gender : null });
          this.ageFormGroup.patchValue({age: typeof userProfileData !== 'undefined' ? userProfileData.age : null });
          this.heightFormGroup.patchValue({height: typeof userProfileData !== 'undefined' ? userProfileData.height : null });
          this.weightFormGroup.patchValue({weight: typeof userProfileData !== 'undefined' ? userProfileData.weight : null });
        }));

    this.nameFormGroup = new FormGroup ({
      name: new FormControl('', {validators: [Validators.required]})
    });
    this.genderFormGroup = new FormGroup ({
      gender: new FormControl('', {validators: [Validators.required]})
    });
    this.ageFormGroup = new FormGroup ({
      age: new FormControl('', {validators: [Validators.required, Validators.min(10), Validators.max(130)]})
    });
    this.heightFormGroup = new FormGroup ({
      height: new FormControl('', {validators: [Validators.required, Validators.min(90), Validators.max(290)]})
    });
    this.weightFormGroup = new FormGroup ({
      weight: new FormControl('', {validators: [Validators.required, Validators.min(20), Validators.max(320)]})
    });

  }

  get name() { return this.nameFormGroup.get('name'); }
  get gender() { return this.genderFormGroup.get('gender'); }
  get age() { return this.ageFormGroup.get('age'); }
  get weight() { return this.weightFormGroup.get('weight'); }
  get height() { return this.heightFormGroup.get('height'); }

  calculate_BMI_BMR() {
    this.bmi = this.profileService.calcBMI(this.weightFormGroup.value.weight, this.heightFormGroup.value.height / 100);
    this.bmr = this.profileService.calcBMR(
      this.genderFormGroup.value.gender, this.ageFormGroup.value.age, this.weightFormGroup.value.weight, this.heightFormGroup.value.height);
  }

  onSave() {
    this.calculate_BMI_BMR();
    this.profileService.addOrUpdateUser({
      email: this.fbUser.email,
      userId: this.fbUser.uid,
      name: this.nameFormGroup.value.name,
      gender: this.genderFormGroup.value.gender,
      age: this.ageFormGroup.value.age,
      weight: this.weightFormGroup.value.weight,
      height: this.heightFormGroup.value.height,
      bmi: this.bmi,
      bmr: this.bmr,
    });
    this.loadLinkToActivityLevel = true;
  }

  tabSelect() {
    this.tabSelected.emit();
  }

  ngOnDestroy() {
    if (this.anthropometrySubs) {
      this.anthropometrySubs.forEach(sub => sub.unsubscribe());
    }
  }

}
