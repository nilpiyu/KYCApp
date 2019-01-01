import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KycDocGroupMappingComponent } from './kyc-doc-group-mapping.component';

describe('KycDocGroupMappingComponent', () => {
  let component: KycDocGroupMappingComponent;
  let fixture: ComponentFixture<KycDocGroupMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KycDocGroupMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KycDocGroupMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
