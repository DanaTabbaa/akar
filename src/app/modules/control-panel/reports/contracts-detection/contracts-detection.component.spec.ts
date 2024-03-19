import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsDetectionComponent } from './contracts-detection.component';

describe('ContractsDetectionComponent', () => {
  let component: ContractsDetectionComponent;
  let fixture: ComponentFixture<ContractsDetectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractsDetectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsDetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
