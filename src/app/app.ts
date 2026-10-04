import { Component, signal } from '@angular/core';
import { NoiseLogForm } from './features/noise-log/noise-log-form/noise-log-form';

@Component({
  selector: 'app-root',
  imports: [NoiseLogForm],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('life-log-frontend');
}
