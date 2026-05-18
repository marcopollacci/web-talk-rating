import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dateRange' })
export class DateRangePipe implements PipeTransform {
  #datePipe = new DatePipe('en-US');

  transform(from: string, to: string): string {
    const fromDate = new Date(from);
    const formatted = (d: Date) =>
      this.#datePipe.transform(d, 'dd/MM/yyyy') ?? '';

    const toDate = new Date(to);

    const sameDay = fromDate.toDateString() === toDate.toDateString();

    if (!sameDay) return `${formatted(fromDate)} → ${formatted(toDate)}`;

    return formatted(fromDate);
  }
}
