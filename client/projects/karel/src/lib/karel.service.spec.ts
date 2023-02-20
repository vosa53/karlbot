import { TestBed } from '@angular/core/testing';

import { KarelService } from './karel.service';

describe('KarelService', () => {
  let service: KarelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KarelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
