import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorisedPersonnelComponent } from './authorised-personnel.component';

describe('AuthorisedPersonnelComponent', () => {
  let component: AuthorisedPersonnelComponent;
  let fixture: ComponentFixture<AuthorisedPersonnelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorisedPersonnelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorisedPersonnelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
