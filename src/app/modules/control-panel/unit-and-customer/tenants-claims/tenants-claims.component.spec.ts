import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantsClaimsComponent } from './tenants-claims.component';

describe('TenantsClaimsComponent', () => {
  let component: TenantsClaimsComponent;
  let fixture: ComponentFixture<TenantsClaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenantsClaimsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantsClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
