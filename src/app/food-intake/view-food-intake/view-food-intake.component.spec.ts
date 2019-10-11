import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFoodIntakeComponent } from './view-food-intake.component';

describe('ViewFoodIntakeComponent', () => {
  let component: ViewFoodIntakeComponent;
  let fixture: ComponentFixture<ViewFoodIntakeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewFoodIntakeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFoodIntakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
