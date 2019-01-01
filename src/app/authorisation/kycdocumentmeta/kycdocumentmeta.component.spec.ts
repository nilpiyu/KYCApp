/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { KycdocumentmetaComponent } from './kycdocumentmeta.component';

describe('KycdocumentmetaComponent', () => {
  let component: KycdocumentmetaComponent;
  let fixture: ComponentFixture<KycdocumentmetaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KycdocumentmetaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KycdocumentmetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
