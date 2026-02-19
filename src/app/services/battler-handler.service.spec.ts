import { TestBed } from '@angular/core/testing';

import { BattlerHandlerService } from './battler-handler.service';

describe('BattlerHandlerService', () => {
  let service: BattlerHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BattlerHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
