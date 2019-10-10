import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PastFoodIntakeComponent } from './past-food-intake.component';

describe('PastFoodIntakeComponent', () => {
  let component: PastFoodIntakeComponent;
  let fixture: ComponentFixture<PastFoodIntakeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PastFoodIntakeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PastFoodIntakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
