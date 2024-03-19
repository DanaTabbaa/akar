import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaintenanceOffersListComponent } from './maintenance-offers-list.component';


describe('MaintenanceOffersListComponent', () => {
  let component: MaintenanceOffersListComponent;
  let fixture: ComponentFixture<MaintenanceOffersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenanceOffersListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceOffersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
