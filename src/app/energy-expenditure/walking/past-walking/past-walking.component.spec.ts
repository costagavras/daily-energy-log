import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PastWalkingComponent } from './past-walking.component';

describe('PastWalkingComponent', () => {
  let component: PastWalkingComponent;
  let fixture: ComponentFixture<PastWalkingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PastWalkingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PastWalkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
