import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SARExchangeBondsComponent } from './sar-exchange-bonds.component';

describe('SARExchangeBondsComponent', () => {
  let component: SARExchangeBondsComponent;
  let fixture: ComponentFixture<SARExchangeBondsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SARExchangeBondsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SARExchangeBondsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
