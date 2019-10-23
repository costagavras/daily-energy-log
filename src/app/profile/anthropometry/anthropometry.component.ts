import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ProfileService } from '../profile.service';
import { Subject } from 'rxjs';

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
bmr1 = 0;
bmr2 = 0;
nameFormGroup: FormGroup;
genderFormGroup: FormGroup;
ageFormGroup: FormGroup;
weightFormGroup: FormGroup;
heightFormGroup: FormGroup;
calcResults = false;

  constructor(public profileService: ProfileService) {}

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
  }

  onSubmit() {
    console.log(this.nameFormGroup.value);
    console.log(this.genderFormGroup.value);
    console.log(this.ageFormGroup.value);
    console.log(this.weightFormGroup.value);
    console.log(this.heightFormGroup.value);
    this.profileService.linkToActivityLevel();

    // this.authService.login({
    //   email: this.loginForm.value.email,
    //   password: this.loginForm.value.password
    // });
  }

}
