import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  imports: [ReactiveFormsModule, NgClass],
  selector: 'app-create',
  styleUrl: './create.scss',
  templateUrl: './create.html',
})
export class Create {
  form = new FormGroup({
    occurrenceDate: new FormControl('', { nonNullable: true }),
    occurrenceTime: new FormControl('', { nonNullable: true }),
    durationCategory: new FormControl('', { nonNullable: true }),
    occurrenceSource: new FormControl('', { nonNullable: true }),
    noiseLevel: new FormControl(0, { nonNullable: true }),
    noiseTypes: new FormControl<string[]>([], { nonNullable: true }),
    memo: new FormControl('', { nonNullable: true }),
  });

  // 継続時間選択肢
  readonly durationOptions = ['0～10分未満', '10～20分未満', '20～30分未満', '30分以上', '不明'];
  // 発生源選択肢
  readonly sourceOptions = ['上の部屋', '隣の部屋', '同じ建物', '近所', 'その他'];
  // 騒音レベル選択肢
  readonly noiseTypeOptions = ['足音', '衝撃音', '物を引きずる音', '話し声', 'その他'];
  // 音の種類選択肢
  readonly soundTypeOptions = ['足音', '衝撃音', '物を引きずる音', '話し声', 'その他'];

  dateInvalid = false;

  normalizeOccurrenceDate(): void {
    const control = this.form.controls.occurrenceDate;
    const value = (control.value || '').trim();

    // 未入力はエラーにしない
    if (!value) {
      this.dateInvalid = false;
      control.setErrors(null);
      return;
    }

    const match =
      value.match(/^(\d{4})(\d{2})(\d{2})$/) ??
      value.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/) ??
      value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);

    if (!match) {
      this.dateInvalid = true;
      control.setErrors({ invalidDate: true });
      return;
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[2]);

    if (!this.isValidDate(year, month, day)) {
      this.dateInvalid = true;
      control.setErrors({ invalidDate: true });
      return;
    }

    const normalized =
      `${String(year).padStart(4, '0')}/` +
      `${String(month).padStart(2, '0')}/` +
      `${String(day).padStart(2, '0')}`;

    this.dateInvalid = false;
    control.setValue(normalized);
    control.setErrors(null);
  }

  private isValidDate(year: number, month: number, day: number): boolean {
    if (month < 1 || month > 12 || day < 1) {
      return false;
    }

    const dayInMonth = [
      31,
      this.isLeapYear(year) ? 29 : 28,
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31,
    ];

    return day <= dayInMonth[month - 1];
  }

  private isLeapYear(year: number): boolean {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
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

  setNoiseLevel(level: number): void {
    this.form.controls.noiseLevel.setValue(level);
  }

  onNoiseLevelKeyDown(event: KeyboardEvent): void {
    const noiseLevel = this.form.controls.noiseLevel;

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      noiseLevel.setValue(Math.min(5, noiseLevel.value + 1));
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      noiseLevel.setValue(Math.max(1, noiseLevel.value - 1));
    }
  }

  toggleNoiseType(type: string, checked: boolean): void {
    const noiseTypes = this.form.controls.noiseTypes;

    if (checked && noiseTypes.value.indexOf(type) === -1) {
      noiseTypes.setValue([...noiseTypes.value, type]);
    } else if (!checked) {
      noiseTypes.setValue(noiseTypes.value.filter((item) => item !== type));
    }
  }

  submit(): void {
    console.log('登録内容：', this.form.getRawValue());
  }
}
