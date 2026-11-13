import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchCondition } from './search-condition';

describe('SearchCondition', () => {
  let component: SearchCondition;
  let fixture: ComponentFixture<SearchCondition>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchCondition],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchCondition);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
