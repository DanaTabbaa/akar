import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaintenanceOffersComponent } from './maintenance-offers.component';


describe('MaintenanceOffersComponent', () => {
  let component: MaintenanceOffersComponent;
  let fixture: ComponentFixture<MaintenanceOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenanceOffersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
