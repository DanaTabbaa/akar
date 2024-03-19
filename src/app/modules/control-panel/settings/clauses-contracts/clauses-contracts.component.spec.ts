import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClausesContractsComponent } from './clauses-contracts.component';

describe('ClausesContractsComponent', () => {
  let component: ClausesContractsComponent;
  let fixture: ComponentFixture<ClausesContractsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClausesContractsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClausesContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
