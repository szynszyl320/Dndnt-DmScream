import { TestBed } from '@angular/core/testing';

import { CharacterHandlerService } from './character-handler.service';

describe('CharacterHandlerService', () => {
  let service: CharacterHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharacterHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
