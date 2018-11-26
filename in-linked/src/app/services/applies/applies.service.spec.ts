import { TestBed, inject } from '@angular/core/testing';

import { AppliesService } from './applies.service';

describe('AppliesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppliesService]
    });
  });

  it('should be created', inject([AppliesService], (service: AppliesService) => {
    expect(service).toBeTruthy();
  }));
});
