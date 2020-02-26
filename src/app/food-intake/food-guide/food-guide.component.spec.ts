import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodGuideComponent } from './food-guide.component';

describe('FoodGuideComponent', () => {
  let component: FoodGuideComponent;
  let fixture: ComponentFixture<FoodGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
