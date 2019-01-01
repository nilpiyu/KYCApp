import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestedDocumentComponent } from './requested-document.component';

describe('RequestedDocumentComponent', () => {
  let component: RequestedDocumentComponent;
  let fixture: ComponentFixture<RequestedDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestedDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestedDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
