import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorCommissionsListComponent } from './vendor-commissions-list.component';

describe('VendorCommissionsListComponent', () => {
  let component: VendorCommissionsListComponent;
  let fixture: ComponentFixture<VendorCommissionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorCommissionsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorCommissionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
