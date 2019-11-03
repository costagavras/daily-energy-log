import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
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
  @Output() tabSelected = new EventEmitter<void>();

  listActivities = [];
  minValue = 0;
  maxValue = 24;
  total: any = 0;
  negativeError: boolean;
  loadLinkToProfileCompleted = false;
  private fbActivitiesListSub: Subscription;
  errorMatcher = new InputErrorStateMatcher();

  constructor(private profileService: ProfileService) { }

  ngOnInit() {

    // need it to activate event emitter in the service
    this.profileService.getActivitiesList();

    this.fbActivitiesListSub = this.profileService.activitiesList
      .subscribe(actList => {
        this.listActivities = actList;
      });

    // need it to activate event emitter in the service
    this.profileService.getUserData();

  }

  onSave(form: NgForm) {
    this.profileService.calcRMR(this.listActivities, Object.values(form.value));
    this.loadLinkToProfileCompleted = true;
  }

  checkMinMax(form: NgForm) {
    const minError = Object.values(form.value).some(item => item < 0);
    const maxError = Object.values(form.value).some(item => item > 24);
    return minError || maxError;
  }

  sumHours(form: NgForm) {
    // 0 stands for initial value
    this.total = Object.values(form.value).reduce((a: number, b: number) => a + b, 0);
  }

  tabSelect() {
    this.tabSelected.emit();
  }

ngOnDestroy() {
    if (this.fbActivitiesListSub) {
      this.fbActivitiesListSub.unsubscribe();
    }
  }

}

