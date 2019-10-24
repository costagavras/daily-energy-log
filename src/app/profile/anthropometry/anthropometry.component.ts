import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ProfileService } from '../profile.service';
import { User } from '../../auth/user.model';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';

@Component({
  selector: 'app-anthropometry',
  templateUrl: './anthropometry.component.html',
  styleUrls: ['./anthropometry.component.css']
})
export class AnthropometryComponent implements OnInit {

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
calcResults = false;
private user: User;

  constructor(public profileService: ProfileService,
              private afAuth: AngularFireAuth) {}

  ngOnInit() {
    this.nameFormGroup = new FormGroup ({
      name: new FormControl('', {validators: [Validators.required]}),
    });
    this.genderFormGroup = new FormGroup ({
      gender: new FormControl('', {validators: [Validators.required]}),
    });
    this.ageFormGroup = new FormGroup ({
      age: new FormControl('', {validators: [Validators.required, Validators.min(10), Validators.max(130)]}),
    });
    this.weightFormGroup = new FormGroup ({
      weight: new FormControl('', {validators: [Validators.required, Validators.min(20), Validators.max(320)]}),
    });
    this.heightFormGroup = new FormGroup ({
      height: new FormControl('', {validators: [Validators.required, Validators.min(90), Validators.max(290)]}),
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
    this.calcResults = true;
  }

  onSave() {
    const user = firebase.auth().currentUser;
    this.profileService.addOrUpdateUser({
      email: user.email,
      userId: user.uid,
      name: this.nameFormGroup.value.name,
      gender: this.genderFormGroup.value.gender,
      age: this.ageFormGroup.value.age,
      weight: this.weightFormGroup.value.weight,
      height: this.heightFormGroup.value.height,
      bmi: this.bmi,
      bmr: this.bmr,
    });
    this.profileService.linkToActivityLevel();
  }

}
