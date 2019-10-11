import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBmrComponent } from './new-bmr.component';

describe('NewBmrComponent', () => {
  let component: NewBmrComponent;
  let fixture: ComponentFixture<NewBmrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewBmrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBmrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
