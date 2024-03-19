import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsClassificationComponent } from './accounts-classification.component';

describe('AccountsClassificationComponent', () => {
  let component: AccountsClassificationComponent;
  let fixture: ComponentFixture<AccountsClassificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountsClassificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsClassificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
