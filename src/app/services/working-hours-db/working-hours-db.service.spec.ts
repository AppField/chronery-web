import { TestBed, inject } from '@angular/core/testing';

import { WorkingHoursDbService } from './working-hours-db.service';

describe('WorkingHoursDbService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkingHoursDbService]
    });
  });

  it('should be created', inject([WorkingHoursDbService], (service: WorkingHoursDbService) => {
    expect(service).toBeTruthy();
  }));
});
