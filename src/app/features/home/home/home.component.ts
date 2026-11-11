import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { DateRangePipe } from '@common/pipes/date-range.pipe';
import { HomeService } from '../services/home.service';

@Component({
  selector: 'app-home',
  imports: [DateRangePipe, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  #homeService = inject(HomeService);
  listEvents = rxResource({
    stream: () => this.#homeService.getEvents(),
    debugName: 'listEvents',
  });
  readonly today = new Date();

  getLabelVote(date: string) {
    const dateEvent = new Date(date);
    return dateEvent > this.today ? 'opens soon' : 'Closed';
  }
}
