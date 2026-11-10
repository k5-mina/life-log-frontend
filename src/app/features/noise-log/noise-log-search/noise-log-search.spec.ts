import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoiseLogSearch } from './noise-log-search';

describe('NoiseLogSearch', () => {
  let component: NoiseLogSearch;
  let fixture: ComponentFixture<NoiseLogSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoiseLogSearch],
    }).compileComponents();

    fixture = TestBed.createComponent(NoiseLogSearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
