import { TestBed } from '@angular/core/testing';
import { NoiseLog } from './noise-log';

describe('NoiseLog', () => {
  let service: NoiseLog;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoiseLog);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
