import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrainingService } from './training/training.service';

@Component({
  selector: 'app-energy-expenditure',
  templateUrl: './energy-expenditure.component.html',
  styleUrls: ['./energy-expenditure.component.css']
})
export class EnergyExpenditureComponent implements OnInit, OnDestroy {

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {}

  ngOnDestroy() {}

}
