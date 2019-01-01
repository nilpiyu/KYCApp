/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SidechainComponent } from './sidechain.component';

describe('SidechainComponent', () => {
  let component: SidechainComponent;
  let fixture: ComponentFixture<SidechainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidechainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidechainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
