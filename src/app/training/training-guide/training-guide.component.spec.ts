import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingGuideComponent } from './training-guide.component';

describe('TrainingGuideComponent', () => {
  let component: TrainingGuideComponent;
  let fixture: ComponentFixture<TrainingGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
