import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationRelationshipMappingComponent } from './verification-relationship-mapping.component';

describe('VerificationRelationshipMappingComponent', () => {
  let component: VerificationRelationshipMappingComponent;
  let fixture: ComponentFixture<VerificationRelationshipMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerificationRelationshipMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationRelationshipMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
