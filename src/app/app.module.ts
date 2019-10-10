import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { FoodIntakeComponent } from './food-intake/food-intake.component';
import { PastFoodIntakeComponent } from './food-intake/past-food-intake/past-food-intake.component';
import { NewFoodIntakeComponent } from './food-intake/new-food-intake/new-food-intake.component';
import { EnergyExpenditureComponent } from './energy-expenditure/energy-expenditure.component';
import { RmrComponent } from './energy-expenditure/rmr/rmr.component';
import { DailyActivityComponent } from './energy-expenditure/daily-activity/daily-activity.component';
import { WalkingComponent } from './energy-expenditure/walking/walking.component';
import { TrainingComponent } from './energy-expenditure/training/training.component';
import { NewTrainingComponent } from './energy-expenditure/training/new-training/new-training.component';
import { PastTrainingComponent } from './energy-expenditure/training/past-training/past-training.component';
import { HomeComponent } from './home/home.component';
import { BalanceComponent } from './balance/balance.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    FoodIntakeComponent,
    PastFoodIntakeComponent,
    NewFoodIntakeComponent,
    EnergyExpenditureComponent,
    RmrComponent,
    DailyActivityComponent,
    WalkingComponent,
    TrainingComponent,
    NewTrainingComponent,
    PastTrainingComponent,
    HomeComponent,
    BalanceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
