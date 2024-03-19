import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLeaseAgreementComponent } from './add-lease-agreement.component';

describe('AddLeaseAgreementComponent', () => {
  let component: AddLeaseAgreementComponent;
  let fixture: ComponentFixture<AddLeaseAgreementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLeaseAgreementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLeaseAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
