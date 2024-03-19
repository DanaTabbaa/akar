import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaintenanceBillsListComponent } from './maintenance-bills-list.component';


describe('MaintenanceBillsListComponent', () => {
  let component: MaintenanceBillsListComponent;
  let fixture: ComponentFixture<MaintenanceBillsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenanceBillsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceBillsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
