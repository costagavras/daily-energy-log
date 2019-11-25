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
          console.log(this.units);
        }
      ));

    this.anthropometrySubs.push(this.profileService.userProfileData
      .subscribe(
        userProfileData => {
          this.nameFormGroup.patchValue({name: typeof userProfileData.name !== 'undefined' ? userProfileData.name : null });
          this.genderFormGroup.patchValue({gender: typeof userProfileData.gender !== 'undefined' ? userProfileData.gender : null });
          this.ageFormGroup.patchValue({age: typeof userProfileData.age !== 'undefined' ? userProfileData.age : null });
          this.heightFormGroup.patchValue({heightCm: typeof userProfileData.height !== 'undefined' ? userProfileData.height : null });
          this.heightFormGroup.patchValue({
            heightFt: typeof userProfileData.height !== 'undefined' ? Math.floor(userProfileData.height / 30.4) : null });
          this.heightFormGroup.patchValue({
            // tslint:disable-next-line: max-line-length
            heightIn: typeof userProfileData.height !== 'undefined' ? Math.round((userProfileData.height - Math.floor(userProfileData.height / 30.4) * 30.4) / 2.54) : null });
          this.weightFormGroup.patchValue({weightKg: typeof userProfileData.weight !== 'undefined' ? userProfileData.weight : null });
          this.weightFormGroup.patchValue({
            weightLb: typeof userProfileData.weight !== 'undefined' ? Math.round(userProfileData.weight / 0.454) : null });
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
      heightCm: new FormControl('', {validators: [Validators.required, Validators.min(90), Validators.max(290)]}),
      heightFt: new FormControl('', {validators: [Validators.required, Validators.min(4), Validators.max(7)]}),
      heightIn: new FormControl('', {validators: [Validators.required, Validators.min(0), Validators.max(11)]})
    });
    this.weightFormGroup = new FormGroup ({
      weightKg: new FormControl('', {validators: [Validators.required, Validators.min(20), Validators.max(320)]}),
      weightLb: new FormControl('', {validators: [Validators.required, Validators.min(50), Validators.max(750)]})
    });

  }

  get name() { return this.nameFormGroup.get('name'); }
  get gender() { return this.genderFormGroup.get('gender'); }
  get age() { return this.ageFormGroup.get('age'); }
  get weightKg() { return this.weightFormGroup.get('weightKg'); }
  get weightLb() { return this.weightFormGroup.get('weightLb'); }
  get heightCm() { return this.heightFormGroup.get('heightCm'); }
  get heightFt() { return this.heightFormGroup.get('heightFt'); }
  get heightIn() { return this.heightFormGroup.get('heightIn'); }

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
      this.height = this.heightFormGroup.value.heightCm;
      this.weight = this.weightFormGroup.value.weightKg;
    } else  {
      this.height = Math.round(this.heightFormGroup.value.heightFt * 30.4 + this.heightFormGroup.value.heightIn * 2.54);
      this.weight = Math.round(this.weightFormGroup.value.weightLb * 0.454);
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
