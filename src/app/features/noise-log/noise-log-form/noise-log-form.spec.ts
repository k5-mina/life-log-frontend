import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoiseLogForm } from './noise-log-form';

describe('NoiseLogForm', () => {
  let component: NoiseLogForm;
  let fixture: ComponentFixture<NoiseLogForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoiseLogForm],
    }).compileComponents();

    fixture = TestBed.createComponent(NoiseLogForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
