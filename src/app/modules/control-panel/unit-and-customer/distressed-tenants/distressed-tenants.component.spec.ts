import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistressedTenantsComponent } from './distressed-tenants.component';

describe('DistressedTenantsComponent', () => {
  let component: DistressedTenantsComponent;
  let fixture: ComponentFixture<DistressedTenantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DistressedTenantsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DistressedTenantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
