import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-noise-log-form',
  styleUrl: './noise-log-form.scss',
  templateUrl: './noise-log-form.html',
})

export class NoiseLogForm {
  noiseLevel = 0;

  selectNoiseLevel(level: number): void {
    console.log('クリック：', this.noiseLevel);

    this.noiseLevel = level;

    console.log('noiseLevel：', this.noiseLevel);
  }
}
