import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubOrganizationComponent } from './sub-organization.component';

describe('SubOrganizationComponent', () => {
  let component: SubOrganizationComponent;
  let fixture: ComponentFixture<SubOrganizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubOrganizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
