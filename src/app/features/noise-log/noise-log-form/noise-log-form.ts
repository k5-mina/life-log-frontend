import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-noise-log-form',
  styleUrl: './noise-log-form.scss',
  templateUrl: './noise-log-form.html',
})

export class NoiseLogForm {
  noiseLogForm = new FormGroup({
    occurrenceDate: new FormControl(''),
    startTime: new FormControl(''),
    endTime: new FormControl(''),
    noiseLevel: new FormControl(0, { nonNullable: true }),
    noiseType: new FormControl(''),
    memo: new FormControl('')
  })

  selectNoiseLevel(level: number): void {
    this.noiseLogForm.controls.noiseLevel.setValue(level);
  }

  onSubmit(): void {
    console.log(this.noiseLogForm.value);
  }
}
