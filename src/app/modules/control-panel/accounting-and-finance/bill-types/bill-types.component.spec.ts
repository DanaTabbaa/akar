import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillTypesComponent } from './bill-types.component';

describe('BillTypesComponent', () => {
  let component: BillTypesComponent;
  let fixture: ComponentFixture<BillTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillTypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
