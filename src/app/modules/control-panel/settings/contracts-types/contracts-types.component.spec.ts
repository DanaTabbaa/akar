import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsTypesComponent } from './contracts-types.component';

describe('ContractsTypesComponent', () => {
  let component: ContractsTypesComponent;
  let fixture: ComponentFixture<ContractsTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractsTypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
