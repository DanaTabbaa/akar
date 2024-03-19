import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecuritiesAndGuardingCompaniesComponent } from './securities-and-guarding-companies.component';

describe('SecuritiesAndGuardingCompaniesComponent', () => {
  let component: SecuritiesAndGuardingCompaniesComponent;
  let fixture: ComponentFixture<SecuritiesAndGuardingCompaniesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecuritiesAndGuardingCompaniesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecuritiesAndGuardingCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
