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

  readonly noiseTypeOptions = ['足音', '衝撃音', '物を引きずる音', '話し声', 'その他'];

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
