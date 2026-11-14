import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-search-condition',
  styleUrl: './search-condition.scss',
  templateUrl: './search-condition.html',
})
export class SearchCondition {
  searchCondition = new FormGroup({
    occurrenceDateFrom: new FormControl('', { nonNullable: true }),
    occurrenceDateTo: new FormControl('', { nonNullable: true }),
    durationCategoryes: new FormControl<string[]>([], { nonNullable: true }),
    occurrenceSources: new FormControl<string[]>([], { nonNullable: true }),
    noiseLevels: new FormControl<number[]>([], { nonNullable: true }),
    soundTypes: new FormControl<string[]>([], { nonNullable: true }),
  });

  // 長さ選択肢
  readonly durationOptions = [
    '0～5分未満',
    '5～10分未満',
    '10～15分未満',
    '15～20分未満',
    '20～25分未満',
    '25～30分未満',
    '30分以上',
    '不明',
  ];

  // 発生源選択肢
  readonly sourceOptions = ['上の部屋', '隣の部屋', '同じ建物', '近所', 'その他'];

  // 騒音レベル選択肢
  readonly noiseLevelOptions = [1, 2, 3, 4, 5];

  // 音の種類選択肢
  readonly soundTypeOptions = ['足音', '衝撃音', '物を引きずる音', '話し声', 'その他'];

  onDurationChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const durationCategoryes = this.searchCondition.controls.durationCategoryes;

    const values = durationCategoryes.value;

    if (input.checked) {
      durationCategoryes.setValue([...values, input.value]);
    } else {
      durationCategoryes.setValue(values.filter((value) => value !== input.value));
    }
  }

  onSourceChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const occurrenceSources = this.searchCondition.controls.occurrenceSources;

    const values = occurrenceSources.value;

    if (input.checked) {
      occurrenceSources.setValue([...values, input.value]);
    } else {
      occurrenceSources.setValue(values.filter((value) => value !== input.value));
    }
  }

  onNoiseLevelChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const noiseLevels = this.searchCondition.controls.noiseLevels;

    const values = noiseLevels.value;
    const value = Number(input.value);

    if (input.checked) {
      noiseLevels.setValue([...values, value]);
    } else {
      noiseLevels.setValue(values.filter((value) => value !== value));
    }
  }

  onSoundTypesChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const soundTypes = this.searchCondition.controls.soundTypes;

    const values = soundTypes.value;

    if (input.checked) {
      soundTypes.setValue([...values, input.value]);
    } else {
      soundTypes.setValue(values.filter((value) => value !== input.value));
    }
  }
}
