import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  imports: [ReactiveFormsModule, MatChipsModule],
  selector: 'app-search-condition',
  styleUrl: './search-condition.scss',
  templateUrl: './search-condition.html',
})
export class SearchCondition {
  searchCondition = new FormGroup({
    occurrenceDateFrom: new FormControl('', { nonNullable: true }),
    occurrenceDateTo: new FormControl('', { nonNullable: true }),
    occurrenceTimeFrom: new FormControl('', { nonNullable: true }),
    occurrenceTimeTo: new FormControl('', { nonNullable: true }),
    durationCategories: new FormControl<string[]>([], { nonNullable: true }),
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
}
