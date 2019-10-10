import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyExpenditureComponent } from './energy-expenditure.component';

describe('EnergyExpenditureComponent', () => {
  let component: EnergyExpenditureComponent;
  let fixture: ComponentFixture<EnergyExpenditureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnergyExpenditureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnergyExpenditureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
