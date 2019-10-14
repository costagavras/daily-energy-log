import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { TrainingService } from './training.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit {
  // exerciseSubscription: Subscription;

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    // this.exerciseSubscription = this.trainingService.exerciseChosen // will fire when we get a new exercise
    //   .subscribe(
    //     exercise => {

    //     }
    //   );
  }

}
