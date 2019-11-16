import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';
import { UIService } from 'src/app/shared/ui.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { DialogAgreeTermsComponent } from './dialog-agree-terms.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  checked = false;
  private signupSubs: Subscription[] = [];

  constructor(private authService: AuthService,
              private uiService: UIService,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.signupSubs.push(this.uiService.loadingStateChanged
    .subscribe(isLoading => {
      this.isLoading = isLoading;
    }));
  }

  onSubmit(form: NgForm) {
    this.authService.registerUser({
      email: form.value.email,
      password: form.value.password
    });
  }

  openTerms() {
  if (!this.checked) {
    this.dialog.open(DialogAgreeTermsComponent);
    }
  }

   ngOnDestroy() {
    if (this.signupSubs) {
      this.signupSubs.forEach(sub => sub.unsubscribe());
    }
  }
}
