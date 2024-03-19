import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorsCommissionsComponent } from './vendors-commissions.component';

describe('VendorsCommissionsComponent', () => {
  let component: VendorsCommissionsComponent;
  let fixture: ComponentFixture<VendorsCommissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorsCommissionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorsCommissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
