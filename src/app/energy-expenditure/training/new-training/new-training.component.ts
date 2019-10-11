import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  maxDate: Date;
  today = new Date();

  constructor() { }

  ngOnInit() {
    this.maxDate = new Date();
  }

  onEnter() {

  }
}
