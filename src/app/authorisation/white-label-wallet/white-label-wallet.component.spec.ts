import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhiteLabelWalletComponent } from './white-label-wallet.component';

describe('WhiteLabelWalletComponent', () => {
  let component: WhiteLabelWalletComponent;
  let fixture: ComponentFixture<WhiteLabelWalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhiteLabelWalletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhiteLabelWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
