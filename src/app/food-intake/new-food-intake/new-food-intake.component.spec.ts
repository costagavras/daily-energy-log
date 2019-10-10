import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFoodIntakeComponent } from './new-food-intake.component';

describe('NewFoodIntakeComponent', () => {
  let component: NewFoodIntakeComponent;
  let fixture: ComponentFixture<NewFoodIntakeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewFoodIntakeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewFoodIntakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
