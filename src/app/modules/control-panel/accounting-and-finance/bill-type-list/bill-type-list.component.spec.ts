import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillTypeListComponent } from './bill-type-list.component';

describe('BillTypeListComponent', () => {
  let component: BillTypeListComponent;
  let fixture: ComponentFixture<BillTypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillTypeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
