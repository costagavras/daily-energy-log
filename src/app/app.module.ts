import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';

import { AuthService } from './auth/auth.service';
import { TrainingService } from './energy-expenditure/training/training.service';

import { AppComponent } from './app.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { FoodIntakeComponent } from './food-intake/food-intake.component';
import { PastFoodIntakeComponent } from './food-intake/past-food-intake/past-food-intake.component';
import { NewFoodIntakeComponent } from './food-intake/new-food-intake/new-food-intake.component';
import { EnergyExpenditureComponent } from './energy-expenditure/energy-expenditure.component';
import { TrainingComponent } from './energy-expenditure/training/training.component';
import { NewTrainingComponent } from './energy-expenditure/training/new-training/new-training.component';
import { PastTrainingComponent } from './energy-expenditure/training/past-training/past-training.component';
import { HomeComponent } from './home/home.component';
import { BalanceComponent } from './balance/balance.component';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { ViewTrainingComponent } from './energy-expenditure/training/view-training/view-training.component';
import { ViewFoodIntakeComponent } from './food-intake/view-food-intake/view-food-intake.component';
import { ProfileComponent } from './profile/profile.component';
import { AnthropometryComponent } from './profile/anthropometry/anthropometry.component';
import { ActivityLevelComponent } from './profile/activity-level/activity-level.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    FoodIntakeComponent,
    PastFoodIntakeComponent,
    NewFoodIntakeComponent,
    EnergyExpenditureComponent,
    TrainingComponent,
    NewTrainingComponent,
    PastTrainingComponent,
    HomeComponent,
    BalanceComponent,
    HeaderComponent,
    SidenavListComponent,
    ViewTrainingComponent,
    ViewFoodIntakeComponent,
    ProfileComponent,
    AnthropometryComponent,
    ActivityLevelComponent,
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
  providers: [AuthService, TrainingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
