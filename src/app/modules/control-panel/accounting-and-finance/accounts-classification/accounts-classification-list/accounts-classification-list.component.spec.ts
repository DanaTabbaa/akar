import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsClassificationListComponent } from './accounts-classification-list.component';

describe('AccountsClassificationListComponent', () => {
  let component: AccountsClassificationListComponent;
  let fixture: ComponentFixture<AccountsClassificationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountsClassificationListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsClassificationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
