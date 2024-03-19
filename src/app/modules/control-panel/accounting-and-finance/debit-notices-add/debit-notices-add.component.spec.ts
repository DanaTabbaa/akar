import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitNoticesAddComponent } from './debit-notices-add.component';

describe('DebitNoticesAddComponent', () => {
  let component: DebitNoticesAddComponent;
  let fixture: ComponentFixture<DebitNoticesAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebitNoticesAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DebitNoticesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
