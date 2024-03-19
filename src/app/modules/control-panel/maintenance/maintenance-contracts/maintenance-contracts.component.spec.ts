import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaintenanceContractsComponent } from './maintenance-contracts.component';


describe('MaintenanceContractsComponent', () => {
  let component: MaintenanceContractsComponent;
  let fixture: ComponentFixture<MaintenanceContractsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenanceContractsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
