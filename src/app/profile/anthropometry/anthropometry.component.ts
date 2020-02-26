import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ProfileService } from '../profile.service';

import { Subscription } from 'rxjs';
import { MatStepper } from '@angular/material';

@Component({
  selector: 'app-anthropometry',
  templateUrl: './anthropometry.component.html',
  styleUrls: ['./anthropometry.component.css']
})
export class AnthropometryComponent implements OnInit, OnDestroy {
  @Output() tabSelected = new EventEmitter<void>();
  // @ViewChild('stepper', {static: false}) stepper: MatStepper;

  minAgeValue = 10;
  minHeightValue = 100;
  minWeightValue = 20;
  bmi = 0;
  bmr = 0;
  nameFormGroup: FormGroup;
  genderFormGroup: FormGroup;
  ageFormGroup: FormGroup;
  weightFormGroupMetric: FormGroup;
  weightFormGroupImperial: FormGroup;
  heightFormGroupMetric: FormGroup;
  heightFormGroupImperial: FormGroup;
  loadLinkToActivityLevel = false;
  fbUser;
  units: string;
  height: number;
  weight: number;
  private anthropometrySubs: Subscription[] = [];

  constructor(public profileService: ProfileService) {}

  ngOnInit() {

    this.fbUser = this.profileService.getFirebaseUser();

    // need it to activate event emitter in the service
    this.profileService.getUserData();

    this.anthropometrySubs.push(this.profileService.unitsUserSelected
      .subscribe(
        units => {
          this.units = units;
        }
      ));

    this.anthropometrySubs.push(this.profileService.userProfileData
      .subscribe(
        userProfileData => {
          if (userProfileData) {
            this.nameFormGroup.patchValue({name: typeof userProfileData.name !== 'undefined' ? userProfileData.name : null });
            this.genderFormGroup.patchValue({gender: typeof userProfileData.gender !== 'undefined' ? userProfileData.gender : null });
            this.ageFormGroup.patchValue({age: typeof userProfileData.age !== 'undefined' ? userProfileData.age : null });
            // tslint:disable-next-line: max-line-length
            this.heightFormGroupMetric.patchValue({heightCm: typeof userProfileData.height !== 'undefined' ? userProfileData.height : null });
            this.heightFormGroupImperial.patchValue({
              heightFt: typeof userProfileData.height !== 'undefined' ? Math.floor(userProfileData.height / 30.4) : null });
            this.heightFormGroupImperial.patchValue({
              // tslint:disable-next-line: max-line-length
              heightIn: typeof userProfileData.height !== 'undefined' ? Math.round((userProfileData.height - Math.floor(userProfileData.height / 30.4) * 30.4) / 2.54) : null });
            // tslint:disable-next-line: max-line-length
            this.weightFormGroupMetric.patchValue({weightKg: typeof userProfileData.weight !== 'undefined' ? userProfileData.weight : null });
            this.weightFormGroupImperial.patchValue({
              weightLb: typeof userProfileData.weight !== 'undefined' ? Math.round(userProfileData.weight / 0.454) : null });
          }
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
    this.heightFormGroupMetric = new FormGroup ({
      heightCm: new FormControl('', {validators: [Validators.required, Validators.min(90), Validators.max(290)]}),
    });
    this.heightFormGroupImperial = new FormGroup ({
      heightFt: new FormControl('', {validators: [Validators.required, Validators.min(3), Validators.max(7)]}),
      heightIn: new FormControl('', {validators: [Validators.required, Validators.min(0), Validators.max(11)]})
    });
    this.weightFormGroupMetric = new FormGroup ({
      weightKg: new FormControl('', {validators: [Validators.required, Validators.min(20), Validators.max(320)]}),
    });
    this.weightFormGroupImperial = new FormGroup ({
      weightLb: new FormControl('', {validators: [Validators.required, Validators.min(50), Validators.max(750)]})
    });

    // this.heightFormGroup.statusChanges.subscribe(
    //   status => {
    //     console.log(status);
    //     if (status === 'VALID') {
    //     }
    //   });

  }

  get name() { return this.nameFormGroup.get('name'); }
  get gender() { return this.genderFormGroup.get('gender'); }
  get age() { return this.ageFormGroup.get('age'); }
  get weightKg() { return this.weightFormGroupMetric.get('weightKg'); }
  get heightCm() { return this.heightFormGroupMetric.get('heightCm'); }
  get weightLb() { return this.weightFormGroupImperial.get('weightLb'); }
  get heightFt() { return this.heightFormGroupImperial.get('heightFt'); }
  get heightIn() { return this.heightFormGroupImperial.get('heightIn'); }

  calculate_BMI_BMR() {
    this.calculateHeightWeight();
    this.bmi = this.profileService.calcBMI(this.weight, this.height / 100);
    this.bmr = this.profileService.calcBMR(
      this.genderFormGroup.value.gender, this.ageFormGroup.value.age, this.weight, this.height);
  }

  onSave() {
    this.calculate_BMI_BMR();
    this.profileService.addOrUpdateUser({
      email: this.fbUser.email,
      userId: this.fbUser.uid,
      name: this.nameFormGroup.value.name,
      gender: this.genderFormGroup.value.gender,
      age: this.ageFormGroup.value.age,
      weight: this.weight,
      height: this.height,
      units: this.units,
      bmi: this.bmi,
      bmr: this.bmr,
    });
    this.loadLinkToActivityLevel = true;
  }

  calculateHeightWeight() {
    if (this.units === 'metric') {
      this.height = this.heightFormGroupMetric.value.heightCm;
      this.weight = this.weightFormGroupMetric.value.weightKg;
    } else  {
      this.height = Math.round(this.heightFormGroupImperial.value.heightFt * 30.4 + this.heightFormGroupImperial.value.heightIn * 2.54);
      this.weight = Math.round(this.weightFormGroupImperial.value.weightLb * 0.454);
    }
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
