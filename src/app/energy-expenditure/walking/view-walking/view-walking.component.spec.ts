import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewWalkingComponent } from './view-walking.component';

describe('ViewWalkingComponent', () => {
  let component: ViewWalkingComponent;
  let fixture: ComponentFixture<ViewWalkingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewWalkingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewWalkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
