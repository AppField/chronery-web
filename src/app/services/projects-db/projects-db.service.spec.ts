import { TestBed, inject } from '@angular/core/testing';

import { ProjectsDbService } from './projects-db.service';

describe('ProjectsDbService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectsDbService]
    });
  });

  it('should be created', inject([ProjectsDbService], (service: ProjectsDbService) => {
    expect(service).toBeTruthy();
  }));
});
