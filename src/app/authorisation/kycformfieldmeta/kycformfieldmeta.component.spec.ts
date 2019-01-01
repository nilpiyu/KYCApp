/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { KycformfieldmetaComponent } from './kycformfieldmeta.component';

describe('KycformfieldmetaComponent', () => {
  let component: KycformfieldmetaComponent;
  let fixture: ComponentFixture<KycformfieldmetaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KycformfieldmetaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KycformfieldmetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
