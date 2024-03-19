import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitLeaseAccountComponent } from './unit-lease-account.component';

describe('UnitLeaseAccountComponent', () => {
  let component: UnitLeaseAccountComponent;
  let fixture: ComponentFixture<UnitLeaseAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitLeaseAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitLeaseAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
