import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitsExpensesComponent } from './units-expenses.component';

describe('UnitsExpensesComponent', () => {
  let component: UnitsExpensesComponent;
  let fixture: ComponentFixture<UnitsExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitsExpensesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitsExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
