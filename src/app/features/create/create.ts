import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { NoiseRecordService } from '../../core/services/noise-record-service';
import { normalizedDate } from '../../shared/utils/date-utils/date-utils';
import { NoiseRecordCreateRequest } from '../../models/noise-record-create-request.model';

@Component({
  imports: [ReactiveFormsModule, NgClass],
  selector: 'app-create',
  styleUrl: './create.scss',
  templateUrl: './create.html',
})
export class Create implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly noiseRecordService = inject(NoiseRecordService);

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

  ngOnInit(): void {
    const date = this.route.snapshot.queryParamMap.get('date');

    if (date) {
      this.form.patchValue({
        occurrenceDate: date,
      });
      this.normalizeOccurrenceDate();
    }
  }

  /**
   * 発生日の値をyyyy/MM/dd形式に補完する
   */
  normalizeOccurrenceDate(): void {
    const control = this.form.controls.occurrenceDate;
    const value = control.value;

    // 未入力はエラーにしない
    if (!value) {
      this.dateInvalid = false;
      control.updateValueAndValidity();
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

  /**
   * カレンダーで選択した日付を発生日に設定する
   *
   * @param event
   */
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

  /**
   * 音の大きさの選択内容を管理する
   *
   * @param level 選択した音の大きさ
   */
  setSoundLevel(level: number): void {
    this.form.controls.soundLevel.setValue(level);
  }

  /**
   * キーボード操作時の音の大きさの変化を制御する
   *
   * @param event キーボード操作
   */
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

  /**
   * 音の種類の選択内容を管理する
   *
   * @param type 選択した音の種類
   * @param checked 音の種類のチェック状態
   */
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
    const request: NoiseRecordCreateRequest = {
      occurrenceDate: formValue.occurrenceDate.replaceAll('/', '-'),
      occurrenceTime: formValue.occurrenceTime,
      durationCategory: this.toDurationCategory(formValue.durationCategory),
      occurrenceSource: formValue.occurrenceSource,
      soundLevel: formValue.soundLevel,
      soundTypes: formValue.soundTypes,
      memo: formValue.memo,
    };

    this.noiseRecordService.register(request).subscribe({
      next: (response: unknown) => {
        console.log('登録成功', response);
      },
      error: (error: unknown) => {
        console.log('登録失敗', error);
      },
    });
  }

  /**
   * 継続時間の値をnumber型に変換する
   */
  private toDurationCategory(value: string): number {
    const categories: Record<string, number> = {
      '0～10分未満': 1,
      '10～20分未満': 2,
      '20～30分未満': 3,
      '30分以上': 4,
      '不明': 5,
    };
    return categories[value];
  }
}
