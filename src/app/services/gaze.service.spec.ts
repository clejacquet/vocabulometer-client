import { TestBed, inject } from '@angular/core/testing';

import { GazeService } from './gaze.service';

describe('GazeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GazeService]
    });
  });

  it('should be created', inject([GazeService], (service: GazeService) => {
    expect(service).toBeTruthy();
  }));
});
