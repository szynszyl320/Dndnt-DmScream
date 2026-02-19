import { TestBed } from '@angular/core/testing';

import { TurnHandlerService } from './turn-handler.service';

describe('TurnHandlerService', () => {
  let service: TurnHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TurnHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
