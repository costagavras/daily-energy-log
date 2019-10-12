import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthService } from '../auth.service';
// import { Subscription } from 'rxjs';

// import { AuthService } from '../auth.service';
// import { UIService } from '../../shared/ui.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  // isLoading = false;
  // private loadingSubs: Subscription;

  constructor(private authService: AuthService) { }
  //             private uiService: UIService)

  ngOnInit() {
    // this.loadingSubs = this.uiService.loadingStateChanged
    //   .subscribe(isLoading => {
    //     this.isLoading = isLoading;
    //   });
    this.loginForm = new FormGroup ({
      email: new FormControl('', {validators: [Validators.required, Validators.email]}),
      password: new FormControl('', {validators: [Validators.required]}),
    });
  }

  onSubmit() {
    this.authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    });
  }

  // getters for validation control
  get email() { return this.loginForm.get('email'); }

  get password() { return this.loginForm.get('password'); }

  ngOnDestroy() {
    // if (this.loadingSubs) {
    //   this.loadingSubs.unsubscribe();
    // }
  }

}
