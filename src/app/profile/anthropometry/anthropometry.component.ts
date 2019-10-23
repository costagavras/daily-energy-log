import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-anthropometry',
  templateUrl: './anthropometry.component.html',
  styleUrls: ['./anthropometry.component.css']
})
export class AnthropometryComponent implements OnInit {

minAgeValue = 10;
minHeightValue = 100;
minWeightValue = 20;
nameFormGroup: FormGroup;
genderFormGroup: FormGroup;
ageFormGroup: FormGroup;
weightFormGroup: FormGroup;
heightFormGroup: FormGroup;

  constructor() {}

  ngOnInit() {
    this.nameFormGroup = new FormGroup ({
      name: new FormControl('', {validators: [Validators.required]}),
    });
    this.genderFormGroup = new FormGroup ({
      gender: new FormControl('', {validators: [Validators.required]}),
    });
    this.ageFormGroup = new FormGroup ({
      age: new FormControl('', {validators: [Validators.required]}),
    });
    this.weightFormGroup = new FormGroup ({
      weight: new FormControl('', {validators: [Validators.required]}),
    });
    this.heightFormGroup = new FormGroup ({
      height: new FormControl('', {validators: [Validators.required]}),
    });
  }

  get name() { return this.nameFormGroup.get('name'); }
  get gender() { return this.genderFormGroup.get('gender'); }
  get age() { return this.ageFormGroup.get('age'); }
  get weight() { return this.weightFormGroup.get('weight'); }
  get height() { return this.heightFormGroup.get('height'); }

  onSubmit() {
    // this.authService.login({
    //   email: this.loginForm.value.email,
    //   password: this.loginForm.value.password
    // });
  }

}
