import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserKycComponent } from './user-kyc.component';

describe('UserKycComponent', () => {
  let component: UserKycComponent;
  let fixture: ComponentFixture<UserKycComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserKycComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserKycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
