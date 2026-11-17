/**
 * 日付文字列をyyyy/MM/dd形式にして返す
 * 不正な日付の場合はnullを返す
 */
export function normalizedDate(value: string): string | null {
  const trimmed = value.trim();

  const match =
    trimmed.match(/^(\d{4})(\d{2})(\d{2})$/) ??
    trimmed.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/) ??
    trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (!isValidDate(year, month, day)) {
    return null;
  }

  const normalized =
    `${String(year).padStart(4, '0')}/` +
    `${String(month).padStart(2, '0')}/` +
    `${String(day).padStart(2, '0')}`;

  return normalized;
}

function isValidDate(year: number, month: number, day: number): boolean {
  if (year < 1 || year > 9999 || month < 1 || month > 12 || day < 1) {
    return false;
  }

  const dayInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  return day <= dayInMonth[month - 1];
}

function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}
