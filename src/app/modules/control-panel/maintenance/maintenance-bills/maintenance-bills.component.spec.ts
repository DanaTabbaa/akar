import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaintenanceBillsComponent } from './maintenance-bills.component';


describe('MaintenanceBillsComponent', () => {
  let component: MaintenanceBillsComponent;
  let fixture: ComponentFixture<MaintenanceBillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenanceBillsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
