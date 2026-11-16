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
