import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-calendar',
  styleUrl: './calendar.scss',
  templateUrl: './calendar.html',
})
export class Calendar {
  private readonly router = inject(Router);

  readonly currentDate = new Date();

  readonly year = this.currentDate.getFullYear();
  readonly month = this.currentDate.getMonth() + 1;

  readonly days = this.createCalendarDays();

  private createCalendarDays(): (number | null)[] {
    const firstDay = new Date(this.year, this.month - 1, 1).getDay();
    const lastDate = new Date(this.year, this.month, 0).getDate();

    // 日曜始まり（0）を月曜始まり（0）に置換
    const offset = firstDay;

    const days: (number | null)[] = Array(offset).fill(null);

    for (let day = 1; day <= lastDate; day++) {
      days.push(day);
    }

    return days;
  }

  openRegisterForm(day: number): void {
    const date = `${this.year}-${String(this.month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    this.router.navigate(['register'], {
      queryParams: { date },
    });
  }
}
