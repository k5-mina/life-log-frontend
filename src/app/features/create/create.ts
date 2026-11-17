import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { CreateService } from './create-service';
import { normalizedDate } from '../../shared/utils/date-utils/date-utils';

@Component({
  imports: [ReactiveFormsModule, NgClass],
  selector: 'app-create',
  styleUrl: './create.scss',
  templateUrl: './create.html',
})
export class Create {
  private readonly noiseRecordService = inject(CreateService);

  form = new FormGroup({
    occurrenceDate: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    occurrenceTime: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    durationCategory: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    occurrenceSource: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    soundLevel: new FormControl(0, {
      nonNullable: true,
      validators: Validators.min(1),
    }),
    soundTypes: new FormControl<string[]>([], {
      nonNullable: true,
      validators: Validators.required,
    }),
    memo: new FormControl('', {
      nonNullable: true,
      validators: Validators.maxLength(200),
    }),
  });

  // 継続時間選択肢
  readonly durationOptions = ['0～10分未満', '10～20分未満', '20～30分未満', '30分以上', '不明'];
  // 発生源選択肢
  readonly sourceOptions = ['上の部屋', '隣の部屋', '同じ建物', '近所', 'その他'];
  // 音の種類選択肢
  readonly soundTypeOptions = ['足音', '衝撃音', '物を引きずる音', '話し声', 'その他'];

  // 日付項目に不正な値が入っているか判定するための変数
  dateInvalid = false;

  normalizeOccurrenceDate(): void {
    const control = this.form.controls.occurrenceDate;
    const value = control.value;

    // 未入力はエラーにしない
    if (!value) {
      this.dateInvalid = false;
      control.setErrors(null);
      return;
    }

    const normalized = normalizedDate(value);

    if (normalized === null) {
      this.dateInvalid = true;
      control.setErrors({ invalidDate: true });
      return;
    }

    this.dateInvalid = false;
    control.setValue(normalized);
    control.setErrors(null);
  }

  onCalendarDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.value) {
      return;
    }

    // type="date"の値はyyyy-MM-dd
    const [year, month, day] = input.value.split('-');
    const value = `${year}/${month}/${day}`;

    this.form.controls.occurrenceDate.setValue(value);
    this.dateInvalid = false;
    this.form.controls.occurrenceDate.setErrors(null);
  }

  setSoundLevel(level: number): void {
    this.form.controls.soundLevel.setValue(level);
  }

  onSoundLevelKeyDown(event: KeyboardEvent): void {
    const soundLevel = this.form.controls.soundLevel;

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      soundLevel.setValue(Math.min(5, soundLevel.value + 1));
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      soundLevel.setValue(Math.max(1, soundLevel.value - 1));
    }
  }

  toggleSoundType(type: string, checked: boolean): void {
    const soundTypes = this.form.controls.soundTypes;

    if (checked && soundTypes.value.indexOf(type) === -1) {
      soundTypes.setValue([...soundTypes.value, type]);
    } else if (!checked) {
      soundTypes.setValue(soundTypes.value.filter((item) => item !== type));
    }
  }

  /**
   * フォームの入力内容をサービスに連携する
   */
  submit(): void {
    // 全項目を触った状態にする
    this.form.markAllAsTouched();
    // ひとつでもバリデーション違反があれば処理を中断する
    if (this.form.invalid) {
      return;
    }

    const formValue = this.form.getRawValue();
    this.noiseRecordService.register(formValue).subscribe({
      next: (response: unknown) => {
        console.log('登録成功', response);
      },
      error: (error: unknown) => {
        console.log('登録失敗', error);
      },
    });
  }
}
