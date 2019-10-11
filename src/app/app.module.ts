import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { FoodIntakeComponent } from './food-intake/food-intake.component';
import { PastFoodIntakeComponent } from './food-intake/past-food-intake/past-food-intake.component';
import { NewFoodIntakeComponent } from './food-intake/new-food-intake/new-food-intake.component';
import { EnergyExpenditureComponent } from './energy-expenditure/energy-expenditure.component';
import { BmrComponent } from './energy-expenditure/bmr/bmr.component';
import { WalkingComponent } from './energy-expenditure/walking/walking.component';
import { TrainingComponent } from './energy-expenditure/training/training.component';
import { NewTrainingComponent } from './energy-expenditure/training/new-training/new-training.component';
import { PastTrainingComponent } from './energy-expenditure/training/past-training/past-training.component';
import { HomeComponent } from './home/home.component';
import { BalanceComponent } from './balance/balance.component';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { ViewTrainingComponent } from './energy-expenditure/training/view-training/view-training.component';
import { ViewFoodIntakeComponent } from './food-intake/view-food-intake/view-food-intake.component';
import { ViewBmrComponent } from './energy-expenditure/bmr/view-bmr/view-bmr.component';
import { NewBmrComponent } from './energy-expenditure/bmr/new-bmr/new-bmr.component';
import { PastBmrComponent } from './energy-expenditure/bmr/past-bmr/past-bmr.component';
import { PastWalkingComponent } from './energy-expenditure/walking/past-walking/past-walking.component';
import { NewWalkingComponent } from './energy-expenditure/walking/new-walking/new-walking.component';
import { ViewWalkingComponent } from './energy-expenditure/walking/view-walking/view-walking.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    FoodIntakeComponent,
    PastFoodIntakeComponent,
    NewFoodIntakeComponent,
    EnergyExpenditureComponent,
    BmrComponent,
    WalkingComponent,
    TrainingComponent,
    NewTrainingComponent,
    PastTrainingComponent,
    HomeComponent,
    BalanceComponent,
    HeaderComponent,
    SidenavListComponent,
    ViewTrainingComponent,
    ViewFoodIntakeComponent,
    ViewBmrComponent,
    NewBmrComponent,
    PastBmrComponent,
    PastWalkingComponent,
    NewWalkingComponent,
    ViewWalkingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
