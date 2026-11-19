import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoiseRecordService } from '../../core/services/noise-record-service';
import { NoiseRecordCountResponse } from '../../models/noise-record-count-response.model';

@Component({
  imports: [MatButtonModule, MatTooltipModule],
  selector: 'app-calendar',
  styleUrl: './calendar.scss',
  templateUrl: './calendar.html',
})
export class Calendar implements OnInit {
  private readonly noiseRecordService = inject(NoiseRecordService);
  private readonly router = inject(Router);

  recordCounts = signal<NoiseRecordCountResponse[]>([]);

  readonly currentDate = new Date();

  // 見出し年月用変数
  year = this.currentDate.getFullYear();
  month = this.currentDate.getMonth() + 1;
  monthEng = new Date(this.year, this.month - 1).toLocaleString('en-US', { month: 'short' });

  // 日にち格納用配列
  days = this.createCalendarDays();

  // 当日強調表示用変数
  readonly todayYear = new Date().getFullYear();
  readonly todayMonth = new Date().getMonth() + 1;
  readonly todayDate = new Date().getDate();

  ngOnInit(): void {
    this.loadRecordCounts();
  }

  private loadRecordCounts(): void {
    this.noiseRecordService.getRecordCount(this.year, this.month).subscribe({
      next: (response) => {
        console.time('件数取得');
        this.recordCounts.set(response);

        requestAnimationFrame(() => {
          console.timeEnd('件数取得');
        });
      },
      error: (error) => {
        console.error('記録件数の取得に失敗しました', error);
      },
    });
  }

  getRecordCount(day: number): number {
    const date = `${this.year}-${String(this.month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    return this.recordCounts().find((record) => record.occurrenceDate === date)?.count ?? 0;
  }

  private createCalendarDays(): (number | null)[] {
    const firstDay = new Date(this.year, this.month - 1, 1).getDay();
    const lastDate = new Date(this.year, this.month, 0).getDate();

    // 月初より前の空白
    const days: (number | null)[] = Array(firstDay).fill(null);

    // 当月の日付
    for (let day = 1; day <= lastDate; day++) {
      days.push(day);
    }

    // 月末より後の空白
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 0; i < remaining; i++) {
      days.push(null);
    }

    return days;
  }

  previousMonth(): void {
    this.setDisplayedMonth(new Date(this.year, this.month - 2, 1));
  }

  nextMonth(): void {
    this.setDisplayedMonth(new Date(this.year, this.month, 1));
  }

  setDisplayedMonth(date: Date): void {
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;

    this.updateCalendar();
    this.recordCounts.set([]);
    this.loadRecordCounts();
  }

  private updateCalendar(): void {
    this.monthEng = new Date(this.year, this.month - 1).toLocaleString('en-US', { month: 'short' });
    this.days = this.createCalendarDays();
  }

  openRegisterForm(day: number): void {
    const date = `${this.year}-${String(this.month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    this.router.navigate(['register'], {
      queryParams: { date },
    });
  }
}
