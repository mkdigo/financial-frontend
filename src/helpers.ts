export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function setToken(token: string | undefined): void {
  localStorage.setItem('token', token ? token : '');
}

export function removeToken(): void {
  localStorage.removeItem('token');
}

export function makeInteger(value: string): number {
  return Number(String(value).replace(/\D/g, ''));
}

export function numberFormat(value: number): string {
  if (value === 0) return '';

  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  }).format(value);
}

export function today() {
  const fullDate = new Date();
  const day =
    fullDate.getDate() < 10 ? '0' + fullDate.getDate() : fullDate.getDate();

  const month =
    fullDate.getMonth() + 1 < 10
      ? '0' + (fullDate.getMonth() + 1)
      : fullDate.getMonth() + 1;

  const year = fullDate.getFullYear();

  return year + '-' + month + '-' + day;
}

export function maskCellPhone(value: string | number): string {
  value = value.toString();

  value = value.replace(/\D/g, '');

  if (value.length > 7) {
    value =
      value.substring(0, 3) +
      '-' +
      value.substring(3, 7) +
      '-' +
      value.substring(7, value.length);
  } else if (value.length > 3) {
    value = value.substring(0, 3) + '-' + value.substring(3, value.length);
  }

  return value;
}

export function maskZipcode(value: string | number): string {
  value = value.toString();

  value = value.replace(/\D/g, '');

  if (value.length > 3) {
    value = value.substring(0, 3) + '-' + value.substring(3, value.length);
  }

  return value;
}

export const getAge = (birthdate: string | undefined): number => {
  if (!birthdate) return 0;

  const birthdateTimestamp = new Date(birthdate).getTime();

  if (isNaN(birthdateTimestamp)) return 0;

  const todayTimestamp = new Date().getTime();
  const diff = new Date(todayTimestamp - birthdateTimestamp).getFullYear();

  return diff - 1970;
};

export class DateTime {
  private today: Date;
  private date: Date;

  constructor(date: string = '') {
    this.today = new Date();
    this.date = date ? new Date(date) : new Date();
  }

  getToday() {
    return this.today
      .toLocaleDateString('ja', {
        month: '2-digit',
        year: 'numeric',
        day: '2-digit',
      })
      .split('/')
      .join('-');
  }

  getDate() {
    return this.date
      .toLocaleDateString('ja', {
        month: '2-digit',
        year: 'numeric',
        day: '2-digit',
      })
      .split('/')
      .join('-');
  }

  setYear(n: number) {
    if (!isNaN(n)) this.date.setFullYear(n);
  }

  addYear(n: number) {
    if (!isNaN(n)) this.date.setFullYear(this.date.getFullYear() + n);
  }

  subtractYear(n: number) {
    if (!isNaN(n)) this.date.setFullYear(this.date.getFullYear() - n);
  }

  setMonth(n: number) {
    if (!isNaN(n)) this.date.setMonth(n - 1);
  }

  addMonth(n: number) {
    if (!isNaN(n)) this.date.setMonth(this.date.getMonth() + n);
  }

  subtractMonth(n: number) {
    if (!isNaN(n)) this.date.setMonth(this.date.getMonth() - n);
  }

  setDay(n: number) {
    if (!isNaN(n)) this.date.setDate(n);
  }

  addDay(n: number) {
    if (!isNaN(n)) this.date.setDate(this.date.getDate() + n);
  }

  subtractDay(n: number) {
    if (!isNaN(n)) this.date.setDate(this.date.getDate() - n);
  }
}
