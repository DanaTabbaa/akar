import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorCommissionsComponent } from './vendor-commissions.component';

describe('VendorCommissionsComponent', () => {
  let component: VendorCommissionsComponent;
  let fixture: ComponentFixture<VendorCommissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorCommissionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorCommissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
