import { TestBed } from '@angular/core/testing';

import { LotofacilService } from './lotofacil.service';

describe('LotofacilService', () => {
  let service: LotofacilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LotofacilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
