import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NoiseLog } from '../noise-log';
import { DateAdapter } from '@angular/material/core';
import { CustomDateAdapter } from '../../../core/date/custom-date-adapter';

@Component({
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  providers: [
    provideNativeDateAdapter(),
    {
      provide: DateAdapter,
      useClass: CustomDateAdapter,
    },
  ],
  selector: 'app-noise-log-form',
  styleUrl: './noise-log-form.scss',
  templateUrl: './noise-log-form.html',
})
export class NoiseLogForm {
  private readonly noiseLogService = inject(NoiseLog);

  noiseLogForm = new FormGroup(
    {
      occurrenceDate: new FormControl<Date | null>(null, {
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

  /**
   * フォームの入力内容をサービスに連携します。
   */
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

  /**
   * フォームの入力内容をクリアします。
   */
  clearForm(): void {
    this.noiseLogForm.reset();
  }
}
