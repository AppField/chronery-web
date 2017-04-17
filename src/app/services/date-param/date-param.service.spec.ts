import { TestBed, inject } from '@angular/core/testing';

import { DateParamService } from './date-param.service';

describe('DateParamService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DateParamService]
    });
  });

  it('should ...', inject([DateParamService], (service: DateParamService) => {
    expect(service).toBeTruthy();
  }));
});
