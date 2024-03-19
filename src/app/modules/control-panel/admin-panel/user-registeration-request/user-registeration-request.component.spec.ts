import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRegisterationRequestComponent } from './user-registeration-request.component';

describe('UserRegisterationRequestComponent', () => {
  let component: UserRegisterationRequestComponent;
  let fixture: ComponentFixture<UserRegisterationRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserRegisterationRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRegisterationRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
