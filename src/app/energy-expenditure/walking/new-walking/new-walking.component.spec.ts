import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewWalkingComponent } from './new-walking.component';

describe('NewWalkingComponent', () => {
  let component: NewWalkingComponent;
  let fixture: ComponentFixture<NewWalkingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewWalkingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewWalkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
