import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { HomeService } from '../services/home.service';

@Component({
  selector: 'app-home',
  imports: [JsonPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  #homeService = inject(HomeService);
  listEvents = rxResource({ loader: () => this.#homeService.getEvents() });
}
