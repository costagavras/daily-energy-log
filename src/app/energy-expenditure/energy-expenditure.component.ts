import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TrainingService } from './training/training.service';

@Component({
  selector: 'app-energy-expenditure',
  templateUrl: './energy-expenditure.component.html',
  styleUrls: ['./energy-expenditure.component.css']
})
export class EnergyExpenditureComponent implements OnInit, OnDestroy {
  exerciseSubscription: Subscription;
  showView = false;

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
        this.exerciseSubscription = this.trainingService.showViewTraining // will fire when we get a new exercise
      .subscribe(val => this.showView = true);
  }

  ngOnDestroy() {
    this.exerciseSubscription.unsubscribe();
  }

}
