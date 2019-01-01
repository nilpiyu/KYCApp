/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MyvotesComponent } from './myvotes.component';

describe('MyvotesComponent', () => {
  let component: MyvotesComponent;
  let fixture: ComponentFixture<MyvotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyvotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyvotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
