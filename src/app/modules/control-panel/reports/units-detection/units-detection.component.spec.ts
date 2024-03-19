import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnitsDetectionComponent } from './units-detection.component';


describe('UnitsDetectionComponent', () => {
  let component: UnitsDetectionComponent;
  let fixture: ComponentFixture<UnitsDetectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitsDetectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitsDetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
