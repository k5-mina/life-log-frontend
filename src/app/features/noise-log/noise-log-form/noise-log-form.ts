import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { NoiseLog } from '../noise-log';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-noise-log-form',
  styleUrl: './noise-log-form.scss',
  templateUrl: './noise-log-form.html',
})
export class NoiseLogForm {
  private readonly noiseLogService = inject(NoiseLog);

  noiseLogForm = new FormGroup(
    {
      occurrenceDate: new FormControl('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      startTime: new FormControl('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      endTime: new FormControl('', {
        nonNullable: true,
      }),
      noiseLevel: new FormControl(0, {
        nonNullable: true,
        validators: Validators.min(1),
      }),
      noiseType: new FormControl('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      memo: new FormControl('', {
        nonNullable: true,
        validators: Validators.maxLength(200),
      }),
    },
    {
      validators: this.timeRangeValidator,
    },
  );

  timeRangeValidator(control: AbstractControl): ValidationErrors | null {
    const startTime = control.get('startTime')?.value;
    const endTime = control.get('endTime')?.value;

    if (!startTime || !endTime) {
      return null;
    }
    if (endTime < startTime) {
      return { invalidTimeRange: true };
    }
    return null;
  }

  selectNoiseLevel(level: number): void {
    const control = this.noiseLogForm.controls.noiseLevel;

    control.setValue(level);
    control.markAsTouched();
  }

  onSubmit(): void {
    // 全項目を触った状態にする
    this.noiseLogForm.markAllAsTouched();
    // 1項目でもバリデーション違反があれば、処理を中断する
    if (this.noiseLogForm.invalid) {
      return;
    }

    const formValue = this.noiseLogForm.getRawValue();
    this.noiseLogService.register(formValue).subscribe({
      next: (responce) => {
        console.log('登録成功：', responce);
      },
      error: (error) => {
        console.error('登録失敗：', error);
      },
    });
  }
}
