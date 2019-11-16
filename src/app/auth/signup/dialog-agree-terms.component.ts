import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog-agree-terms',
  template: `<h2 mat-dialog-title fxLayoutAlign="center" style="margin: 0">Hi user!</h2>
            <mat-dialog-content fxLayoutAlign="center">
              <p>Gotta put some legalese here but didn't come up with any yet. So use with caution and discretion :)</p>
            </mat-dialog-content>
            <mat-dialog-actions fxLayoutAlign="center">
              <button mat-raised-button style="background: gainsboro;" [mat-dialog-close]="true">Ok</button>
            </mat-dialog-actions>`
})
export class DialogAgreeTermsComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public passedData: any) {}
}
