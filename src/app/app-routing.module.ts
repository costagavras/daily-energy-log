import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { FoodIntakeComponent } from './food-intake/food-intake.component';
import { BalanceComponent } from './balance/balance.component';
import { AuthGuard } from './auth/auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { TrainingComponent } from './training/training.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent},
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'food-intake', component: FoodIntakeComponent, canActivate: [AuthGuard] },
  { path: 'training', component: TrainingComponent, canActivate: [AuthGuard] },
  { path: 'log', component: BalanceComponent, canActivate: [AuthGuard] }
];

@NgModule({
  // imports: [RouterModule.forRoot(routes)],
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
