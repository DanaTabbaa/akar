import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaintenanceContractsListComponent } from './maintenance-contracts-list.component';


describe('MaintenanceContractsListComponent', () => {
  let component: MaintenanceContractsListComponent;
  let fixture: ComponentFixture<MaintenanceContractsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenanceContractsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceContractsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
