import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsTypesListComponent } from './accounts-types-list.component';

describe('AccountsTypesListComponent', () => {
  let component: AccountsTypesListComponent;
  let fixture: ComponentFixture<AccountsTypesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountsTypesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsTypesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
