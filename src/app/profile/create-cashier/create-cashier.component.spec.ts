import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCashierComponent } from './create-cashier.component';

describe('CreateCashierComponent', () => {
  let component: CreateCashierComponent;
  let fixture: ComponentFixture<CreateCashierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCashierComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCashierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
