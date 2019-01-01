/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ForgingComponent } from './forging.component';

describe('ForgingComponent', () => {
  let component: ForgingComponent;
  let fixture: ComponentFixture<ForgingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
