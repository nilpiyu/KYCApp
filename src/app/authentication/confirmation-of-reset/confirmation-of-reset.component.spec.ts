import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationOfResetComponent } from './confirmation-of-reset.component';

describe('ConfirmationOfResetComponent', () => {
  let component: ConfirmationOfResetComponent;
  let fixture: ComponentFixture<ConfirmationOfResetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmationOfResetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationOfResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
