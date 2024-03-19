import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitServicesListComponent } from './unit-services-list.component';

describe('UnitServicesListComponent', () => {
  let component: UnitServicesListComponent;
  let fixture: ComponentFixture<UnitServicesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitServicesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitServicesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
