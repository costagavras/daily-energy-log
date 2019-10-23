import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProfileService } from './profile.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
loadLinkToActivityLevel = false;
subOpenActivityLevel: Subscription;

  constructor(private profileService: ProfileService) { }

  ngOnInit() {
    this.subOpenActivityLevel = this.profileService.openActivityLevel
      .subscribe(condition => this.loadLinkToActivityLevel = condition);
  }


  ngOnDestroy() {
    if (this.subOpenActivityLevel) {
      this.subOpenActivityLevel.unsubscribe();
    }
  }

}
