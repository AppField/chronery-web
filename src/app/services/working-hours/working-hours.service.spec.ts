import { TestBed, inject } from '@angular/core/testing';

import { WorkingHoursService } from './working-hours.service';

describe('WorkingHoursService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkingHoursService]
    });
  });

  it('should be created', inject([WorkingHoursService], (service: WorkingHoursService) => {
    expect(service).toBeTruthy();
  }));
});
