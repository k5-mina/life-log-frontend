import { Component, ElementRef, HostListener, OnInit, signal, ViewChild } from '@angular/core';
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

  // 年月選択パネルの要素
  @ViewChild('calendarNavigation')
  calendarNavigation!: ElementRef<HTMLElement>;

  // 表示中年月の記録件数
  recordCounts = signal<NoiseRecordCountResponse[]>([]);
  // 年月選択パネルの表示状態
  isYearMonthSelectorOpen = signal(false);

  // 現在日付
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

  // 選択中の年月
  selectedYear = this.year;
  selectedMonth = this.month;

  // 月の選択肢
  readonly months = Array.from({ length: 12 }, (_, i) => i + 1);

  ngOnInit(): void {
    console.log('月の選択肢', this.months);
    this.loadRecordCounts();
  }

  /**
   * 対象月の記録件数を取得する
   */
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

  /**
   * 対象年月日の記録件数を返す
   *
   * @param day 対象年月日
   * @returns 対象年月日の記録件数
   */
  getRecordCount(day: number): number {
    const date = `${this.year}-${String(this.month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    return this.recordCounts().find((record) => record.occurrenceDate === date)?.count ?? 0;
  }

  /**
   * 前月に移動する
   */
  previousMonth(): void {
    this.setDisplayedMonth(new Date(this.year, this.month - 2, 1));
  }

  /**
   * 翌月に移動する
   */
  nextMonth(): void {
    this.setDisplayedMonth(new Date(this.year, this.month, 1));
  }

  /**
   * カレンダーを描画する
   *
   * @param date 対象年月日
   */
  setDisplayedMonth(date: Date): void {
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;

    this.updateCalendar();
    this.recordCounts.set([]);
    this.loadRecordCounts();
  }

  /**
   * カレンダーのヘッダーを再描画する
   */
  private updateCalendar(): void {
    this.monthEng = new Date(this.year, this.month - 1).toLocaleString('en-US', { month: 'short' });
    this.days = this.createCalendarDays();
  }

  /**
   * 対象年月のカレンダー用の配列を作成する
   *
   * @returns 対象年月の日付の配列
   */
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

  /**
   * 年月選択パネルを開く
   */
  toggleYearMonthSeletor(): void {
    if (!this.isYearMonthSelectorOpen()) {
      this.selectedYear = this.year;
      this.selectedMonth = this.month;
    }

    this.isYearMonthSelectorOpen.update((open) => !open);
  }

  /**
   * 選択中の年を切り替える
   *
   * @param amount 選択した年
   */
  changeSelectedYear(amount: number): void {
    this.selectedYear += amount;
  }

  /**
   * 選択中の月を切り替える
   *
   * @param month 選択した月
   */
  changeSelectedMonth(month: number): void {
    this.selectedMonth = month;
  }

  /**
   * 年月選択パネルで指定した年月にジャンプする
   */
  jumpToSelectedMonth(): void {
    this.setDisplayedMonth(new Date(this.selectedYear, this.selectedMonth - 1, 1));
    this.isYearMonthSelectorOpen.set(false);
  }

  /**
   * 年月選択パネルを閉じる
   */
  closeYearMonthSelector(): void {
    this.isYearMonthSelectorOpen.set(false);
  }

  /**
   * 画面クリック時に年月選択パネルを閉じる
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isYearMonthSelectorOpen()) {
      return;
    }

    const target = event.target;

    if (target instanceof Node && !this.calendarNavigation.nativeElement.contains(target)) {
      this.closeYearMonthSelector();
    }
  }

  /**
   * 新規登録画面へ遷移する
   * 遷移後は押したボタンの日付を発生日の初期値として設定する
   * @param day 記録作成対象の日付
   */
  openCreateForm(day: number): void {
    const date = `${this.year}-${String(this.month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    this.router.navigate(['create'], {
      queryParams: { date },
    });
  }
}
