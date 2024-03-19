import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyBenefitsComponent } from './daily-benefits.component';

describe('DailyBenefitsComponent', () => {
  let component: DailyBenefitsComponent;
  let fixture: ComponentFixture<DailyBenefitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyBenefitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyBenefitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
