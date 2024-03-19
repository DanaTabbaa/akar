import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeTimeDebtComponent } from './life-time-debt.component';

describe('LifeTimeDebtComponent', () => {
  let component: LifeTimeDebtComponent;
  let fixture: ComponentFixture<LifeTimeDebtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LifeTimeDebtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LifeTimeDebtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
