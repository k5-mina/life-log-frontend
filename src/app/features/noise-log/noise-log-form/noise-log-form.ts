import { Component, inject, OnInit } from '@angular/core';
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
import { ActivatedRoute } from '@angular/router';

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
export class NoiseLogForm implements OnInit {
  private readonly noiseLogService = inject(NoiseLog);

  private readonly route = inject(ActivatedRoute);

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

  ngOnInit(): void {
    const date = this.route.snapshot.queryParamMap.get('date');

    if (date) {
      const [year, month, day] = date.split('-').map(Number);

      this.noiseLogForm.patchValue({
        occurrenceDate: new Date(year, month - 1, day),
      });
    }
  }

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
      next: (response: unknown) => {
        console.log('登録成功：', response);
      },
      error: (error: unknown) => {
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
