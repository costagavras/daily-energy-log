import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';
import { HttpClientModule } from '@angular/common/http';

import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { AuthService } from './auth/auth.service';
import { TrainingService } from './energy-expenditure/training/training.service';
import { UIService } from './shared/ui.service';
import { FoodService } from './food-intake/food.service';
import { ProfileService } from './profile/profile.service';

import { AppComponent } from './app.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';

import { FoodIntakeComponent } from './food-intake/food-intake.component';
import { NewFoodIntakeComponent } from './food-intake/new-food-intake/new-food-intake.component';
import { ViewFoodIntakeComponent } from './food-intake/view-food-intake/view-food-intake.component';
import { PastFoodIntakeComponent } from './food-intake/past-food-intake/past-food-intake.component';
import { AddFoodComponent } from './food-intake/add-food/add-food.component';

import { EnergyExpenditureComponent } from './energy-expenditure/energy-expenditure.component';
import { TrainingComponent } from './energy-expenditure/training/training.component';
import { NewTrainingComponent } from './energy-expenditure/training/new-training/new-training.component';
import { ViewTrainingComponent } from './energy-expenditure/training/view-training/view-training.component';
import { PastTrainingComponent } from './energy-expenditure/training/past-training/past-training.component';

import { HomeComponent } from './home/home.component';
import { BalanceComponent } from './balance/balance.component';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';

import { ProfileComponent } from './profile/profile.component';
import { AnthropometryComponent } from './profile/anthropometry/anthropometry.component';
import { ActivityLevelComponent } from './profile/activity-level/activity-level.component';
import { ProfileCompletedComponent } from './profile/profile-completed/profile-completed.component';
import { DialogDeleteProfileComponent } from './profile/profile-completed/dialog-delete-profile.component';
import { DialogAddCategoryComponent } from './food-intake/new-food-intake/dialog-add-category.component';

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
    ProfileCompletedComponent,
    DialogDeleteProfileComponent,
    AddFoodComponent,
    DialogAddCategoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase), /// imports firebase/app needed for everything
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    HttpClientModule
  ],
  providers: [AuthService, TrainingService, FoodService, UIService, ProfileService],
  bootstrap: [AppComponent],
  entryComponents: [DialogDeleteProfileComponent, DialogAddCategoryComponent]
})
export class AppModule { }
