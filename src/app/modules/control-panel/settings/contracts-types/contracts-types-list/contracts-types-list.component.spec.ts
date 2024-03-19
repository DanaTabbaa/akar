import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsTypesListComponent } from './contracts-types-list.component';

describe('ContractsTypesListComponent', () => {
  let component: ContractsTypesListComponent;
  let fixture: ComponentFixture<ContractsTypesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractsTypesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsTypesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
