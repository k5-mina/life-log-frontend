import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-create',
  styleUrl: './create.scss',
  templateUrl: './create.html',
})
export class Create {
  entry = {
    occurrenceDate: '',
    occurrenceTime: '',
    durationCategory: '',
    occurrenceSource: '',
    noiseLevel: 0,
    noiseTypes: [] as string[],
    memo: '',
  };

  readonly noiseTypeOptions = ['足音', '衝撃音', '物を引きずる音', '話し声', 'その他'];

  setNoiseLevel(level: number): void {
    this.entry.noiseLevel = level;
  }

  onNoiseLevelKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.entry.noiseLevel = Math.min(5, this.entry.noiseLevel + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.entry.noiseLevel = Math.max(1, this.entry.noiseLevel - 1);
    }
  }

  toggleNoiseType(type: string, checked: boolean): void {
    if (checked && this.entry.noiseTypes.indexOf(type) === -1) {
      this.entry.noiseTypes.push(type);
    } else if (!checked) {
      this.entry.noiseTypes = this.entry.noiseTypes.filter((item) => item !== type);
    }
  }

  submit(): void {
    console.log('登録内容：', this.entry);
  }
}
