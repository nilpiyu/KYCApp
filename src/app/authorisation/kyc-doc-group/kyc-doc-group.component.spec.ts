import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KycDocGroupComponent } from './kyc-doc-group.component';

describe('KycDocGroupComponent', () => {
  let component: KycDocGroupComponent;
  let fixture: ComponentFixture<KycDocGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KycDocGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KycDocGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
