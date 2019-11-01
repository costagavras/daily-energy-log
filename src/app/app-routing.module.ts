import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { FoodIntakeComponent } from './food-intake/food-intake.component';
import { EnergyExpenditureComponent } from './energy-expenditure/energy-expenditure.component';
import { BalanceComponent } from './balance/balance.component';
import { AuthGuard } from './auth/auth.guard';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent},
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'food-intake', component: FoodIntakeComponent, canActivate: [AuthGuard] },
  { path: 'energy-expenditure', component: EnergyExpenditureComponent, canActivate: [AuthGuard] },
  { path: 'log', component: BalanceComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
