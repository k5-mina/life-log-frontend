import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [MatButtonModule],
  selector: 'app-calendar',
  styleUrl: './calendar.scss',
  templateUrl: './calendar.html',
})
export class Calendar {
  private readonly router = inject(Router);

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

  private createCalendarDays(): (number | null)[] {
    const firstDay = new Date(this.year, this.month - 1, 1).getDay();
    const lastDate = new Date(this.year, this.month, 0).getDate();

    // 日曜始まり（0）
    const offset = firstDay;

    const days: (number | null)[] = Array(offset).fill(null);

    for (let day = 1; day <= lastDate; day++) {
      days.push(day);
    }

    return days;
  }

  previousMonth(): void {
    const date = new Date(this.year, this.month - 2, 1);
    this.setDisplayedMonth(date);
  }

  nextMonth(): void {
    const date = new Date(this.year, this.month, 1);
    this.setDisplayedMonth(date);
  }

  setDisplayedMonth(date: Date): void {
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
    this.updateCalendar();
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
