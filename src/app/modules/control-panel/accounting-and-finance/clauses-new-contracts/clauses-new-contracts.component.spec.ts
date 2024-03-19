import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClausesNewContractsComponent } from './clauses-new-contracts.component';

describe('ClausesNewContractsComponent', () => {
  let component: ClausesNewContractsComponent;
  let fixture: ComponentFixture<ClausesNewContractsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClausesNewContractsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClausesNewContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
