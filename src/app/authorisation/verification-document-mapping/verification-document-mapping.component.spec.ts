import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationDocumentMappingComponent } from './verification-document-mapping.component';

describe('VerificationDocumentMappingComponent', () => {
  let component: VerificationDocumentMappingComponent;
  let fixture: ComponentFixture<VerificationDocumentMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerificationDocumentMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationDocumentMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
