import { TestBed } from '@angular/core/testing';

import { MovieDetailsApiService } from './movie-details-api.service';

describe('MovieDetailsApiService', () => {
  let service: MovieDetailsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovieDetailsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
