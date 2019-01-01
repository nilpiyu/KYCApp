/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BKVSVerificationGrantAccessComponent } from './bkvs-verification-grantaccess.component';

describe('BKVSVerificationGrantAccessComponent', () => {
  let component: BKVSVerificationGrantAccessComponent;
  let fixture: ComponentFixture<BKVSVerificationGrantAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BKVSVerificationGrantAccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BKVSVerificationGrantAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
