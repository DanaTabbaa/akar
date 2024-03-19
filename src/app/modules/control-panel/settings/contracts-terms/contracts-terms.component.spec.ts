import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsTermsComponent } from './contracts-terms.component';

describe('ContractsTermsComponent', () => {
  let component: ContractsTermsComponent;
  let fixture: ComponentFixture<ContractsTermsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractsTermsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
