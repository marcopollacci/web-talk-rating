import { JsonPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-single-event',
  imports: [JsonPipe],
  templateUrl: './single-event.component.html',
  styleUrl: './single-event.component.scss',
})
export class SingleEventComponent {
  #eventSrv = inject(EventService);
  eventId = input.required<string>();

  eventData = rxResource({
    request: () => ({ event: this.eventId() }),
    loader: ({ request }) => this.#eventSrv.getSingleEventevent(request.event),
  });
}
