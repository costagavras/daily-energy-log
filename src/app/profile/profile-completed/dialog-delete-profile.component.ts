import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog-delete-profile',
  template: `<h2 mat-dialog-title fxLayoutAlign="center" style="margin: 0">WARNING!</h2>
            <mat-dialog-content fxLayoutAlign="center">
              <p><mat-chip> {{passedData.user.name}} </mat-chip>
              will be lost forever!</p>
            </mat-dialog-content>
            <mat-dialog-actions fxLayoutAlign="center">
              <button mat-button [mat-dialog-close]="true">Yes</button>
              <button mat-button [mat-dialog-close]="false">No</button>
            </mat-dialog-actions>`
})
export class DialogDeleteProfileComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public passedData: any) {}
}
