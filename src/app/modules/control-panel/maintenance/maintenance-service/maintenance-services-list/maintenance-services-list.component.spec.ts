import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceServicesListComponent } from './maintenance-services-list.component';

describe('MaintenanceServicesListComponent', () => {
  let component: MaintenanceServicesListComponent;
  let fixture: ComponentFixture<MaintenanceServicesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenanceServicesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceServicesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
