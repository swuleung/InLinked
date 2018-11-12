import { TestBed, inject } from '@angular/core/testing';

import { JobsearchService } from './jobsearch.service';

describe('JobsearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JobsearchService]
    });
  });

  it('should be created', inject([JobsearchService], (service: JobsearchService) => {
    expect(service).toBeTruthy();
  }));
});
