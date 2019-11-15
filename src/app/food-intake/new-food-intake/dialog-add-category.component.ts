import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog-add-category',
  template: `<h2 mat-dialog-title fxLayoutAlign="center" style="margin: 0">Choose category</h2>
            <mat-dialog-content fxLayoutAlign="center">
              <mat-form-field class="food-category" appearance="fill">
              <mat-label>Choose food category</mat-label>
              <mat-select ngModel name="foodCategory" required #foodCategoryInput="ngModel">
                <mat-option *ngFor="let category of passedData.foodCategories" [value]="category">
                  {{ category }}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="foodCategoryInput.hasError('required')">Field must not be empty.</mat-error>
              </mat-form-field>
            </mat-dialog-content>
            <mat-dialog-actions fxLayoutAlign="center">
              <button mat-button [disabled]="foodCategoryInput.invalid" [mat-dialog-close]="foodCategoryInput.value">Ok</button>
            </mat-dialog-actions>`
})
export class DialogAddCategoryComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public passedData: any) {}
}


