import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillDuesComponent } from './bill-dues.component';

describe('BillDuesComponent', () => {
  let component: BillDuesComponent;
  let fixture: ComponentFixture<BillDuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillDuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillDuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
