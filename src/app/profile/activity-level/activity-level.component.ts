import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProfileService } from '../profile.service';
import { Subscription } from 'rxjs';
import { NgForm, FormControl, FormGroupDirective } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';



export class InputErrorStateMatcher implements ErrorStateMatcher {

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {

    if (control.value < 0 || control.value > 24 || control.value === null) {
      return true;
    }
  }
}


@Component({
  selector: 'app-activity-level',
  templateUrl: './activity-level.component.html',
  styleUrls: ['./activity-level.component.css']
})
export class ActivityLevelComponent implements OnInit, OnDestroy {

  listActivities = [];
  minValue = 0;
  total: any = 0;
  negativeError: boolean;
  private fbActivitiesListSub: Subscription;
  errorMatcher = new InputErrorStateMatcher();

  constructor(private profileService: ProfileService) { }

  ngOnInit() {

    this.profileService.getActivitiesList();

    this.fbActivitiesListSub = this.profileService.activitiesList
      .subscribe(actList => {
        this.listActivities = actList;
        // console.log(this.listActivities);
      });
  }

  onSave(form: NgForm) {
    console.log("I saved");
  }

  checkMinMax(form: NgForm) {
    const minError = Object.values(form.value).some(item => item < 0);
    const maxError = Object.values(form.value).some(item => item > 24);
    return minError || maxError;
  }

  sumHours(form: NgForm) {
    // console.log(form.value.hours_0);
    // 0 stands for initial value
    this.total = Object.values(form.value).reduce((a: number, b: number) => a + b, 0);

    // Object.keys(form.value).forEach((key: string) => {
    //   this.total += form.value[key];
    // });
    // return this.total;
  }

ngOnDestroy() {
    if (this.fbActivitiesListSub) {
      this.fbActivitiesListSub.unsubscribe();
    }
  }

}

