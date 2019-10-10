import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { FoodIntakeComponent } from './food-intake/food-intake.component';
import { EnergyExpenditureComponent } from './energy-expenditure/energy-expenditure.component';
import { BalanceComponent } from './balance/balance.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent},
  { path: 'food-intake', component: FoodIntakeComponent },
  { path: 'energy-expenditure', component: EnergyExpenditureComponent },
  { path: 'balance', component: BalanceComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
