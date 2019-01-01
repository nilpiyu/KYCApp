import { TestBed, inject } from '@angular/core/testing';

import { AuthorizationApiService } from './authorization-api.service';

describe('AuthorizationApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthorizationApiService]
    });
  });

  it('should be created', inject([AuthorizationApiService], (service: AuthorizationApiService) => {
    expect(service).toBeTruthy();
  }));
});
