import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBmrComponent } from './view-bmr.component';

describe('ViewBmrComponent', () => {
  let component: ViewBmrComponent;
  let fixture: ComponentFixture<ViewBmrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewBmrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBmrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
