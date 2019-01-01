/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { KycformfieldComponent } from './kycformfield.component';

describe('KycformfieldComponent', () => {
  let component: KycformfieldComponent;
  let fixture: ComponentFixture<KycformfieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KycformfieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KycformfieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
