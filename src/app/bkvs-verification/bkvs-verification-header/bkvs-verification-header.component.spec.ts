import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BkvsVerificationHeaderComponent } from './bkvs-verification-header.component';

describe('BkvsVerificationHeaderComponent', () => {
  let component: BkvsVerificationHeaderComponent;
  let fixture: ComponentFixture<BkvsVerificationHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BkvsVerificationHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BkvsVerificationHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
