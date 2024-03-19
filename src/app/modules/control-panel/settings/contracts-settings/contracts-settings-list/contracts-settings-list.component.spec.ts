import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsSettingsListComponent } from './contracts-settings-list.component';

describe('ContractsSettingsListComponent', () => {
  let component: ContractsSettingsListComponent;
  let fixture: ComponentFixture<ContractsSettingsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractsSettingsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsSettingsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
