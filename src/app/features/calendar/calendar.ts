import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-calendar',
  styleUrl: './calendar.scss',
  templateUrl: './calendar.html',
})
export class Calendar {
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

    console.log('lastday:', lastDate);
    console.log('days:', days);

    return days;
  }
}
