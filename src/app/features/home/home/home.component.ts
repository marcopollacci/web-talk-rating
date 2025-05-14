import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { HomeService } from '../services/home.service';

@Component({
  selector: 'app-home',
  imports: [DatePipe, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  #homeService = inject(HomeService);
  #router = inject(Router);
  listEvents = rxResource({ loader: () => this.#homeService.getEvents() });

  navigate(id: string) {
    this.#router.navigate([`/events/add-rating/${id}`]);
  }
}
