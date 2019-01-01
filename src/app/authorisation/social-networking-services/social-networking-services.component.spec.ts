import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialNetworkingServicesComponent } from './social-networking-services.component';

describe('SocialNetworkingServicesComponent', () => {
  let component: SocialNetworkingServicesComponent;
  let fixture: ComponentFixture<SocialNetworkingServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialNetworkingServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialNetworkingServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
