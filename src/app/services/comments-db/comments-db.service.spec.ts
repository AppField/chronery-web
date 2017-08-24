import { TestBed, inject } from '@angular/core/testing';

import { CommentsDbService} from './comments-db.service';

describe('CommentsDbService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommentsDbService]
    });
  });

  it('should be created', inject([CommentsDbService], (service: CommentsDbService) => {
    expect(service).toBeTruthy();
  }));
});
