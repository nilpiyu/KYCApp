/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SessionExpireService } from './session-expire.service';

describe('Service: SessionExpire', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionExpireService]
    });
  });

  it('should ...', inject([SessionExpireService], (service: SessionExpireService) => {
    expect(service).toBeTruthy();
  }));
});