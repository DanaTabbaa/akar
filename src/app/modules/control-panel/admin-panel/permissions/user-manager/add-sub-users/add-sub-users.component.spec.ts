import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubUsersComponent } from './add-sub-users.component';

describe('AddSubUsersComponent', () => {
  let component: AddSubUsersComponent;
  let fixture: ComponentFixture<AddSubUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSubUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSubUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
