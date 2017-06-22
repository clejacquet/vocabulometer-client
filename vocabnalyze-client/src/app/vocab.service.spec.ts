import { TestBed, inject } from '@angular/core/testing';

import { VocabService } from './vocab.service';

describe('VocabService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VocabService]
    });
  });

  it('should be created', inject([VocabService], (service: VocabService) => {
    expect(service).toBeTruthy();
  }));
});
