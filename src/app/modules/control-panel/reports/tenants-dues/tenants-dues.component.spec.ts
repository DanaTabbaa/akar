import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantsDuesComponent } from './tenants-dues.component';

describe('TenantsDuesComponent', () => {
  let component: TenantsDuesComponent;
  let fixture: ComponentFixture<TenantsDuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenantsDuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantsDuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
