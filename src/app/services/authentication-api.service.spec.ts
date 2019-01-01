import { TestBed, inject } from '@angular/core/testing';

import { AuthenticationApiService } from './authentication-api.service';

describe('AuthenticationApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthenticationApiService]
    });
  });

  it('should be created', inject([AuthenticationApiService], (service: AuthenticationApiService) => {
    expect(service).toBeTruthy();
  }));
});
