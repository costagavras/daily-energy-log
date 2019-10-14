import { NgModule } from '@angular/core';
import { MatButtonModule,
          MatIconModule,
          MatFormFieldModule,
          MatInputModule,
          MatDatepickerModule,
          MatNativeDateModule,
          MatCheckboxModule,
          MatSidenavModule,
          MatToolbarModule,
          MatListModule,
          MatTabsModule,
          MatCardModule,
          MatSelectModule,
          MatDialogModule,
          MatTableModule,
          MatSortModule,
          MatPaginatorModule,
          MatSnackBarModule,
          MatExpansionModule
} from '@angular/material';


@NgModule({
  imports: [
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatTabsModule,
    MatCardModule,
    MatSelectModule,
    // MatDialogModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    // MatSnackBarModule
    MatExpansionModule
  ],
  exports: [
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatTabsModule,
    MatCardModule,
    MatSelectModule,
    // MatDialogModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    // MatSnackBarModule
    MatExpansionModule

  ]
})
export class MaterialModule {}
