import { Component, effect, inject, input } from '@angular/core';
import { VoteFormInterface } from '../models/vote.model';
import { EventService } from '../services/event.service';
import { FormVoteComponent } from './components/form-vote/form-vote.component';

@Component({
  selector: 'app-add-rating',
  imports: [FormVoteComponent],
  templateUrl: './add-rating.component.html',
  styleUrl: './add-rating.component.scss',
})
export class AddRatingComponent {
  #eventSrv = inject(EventService);
  eventId = input.required<string>();
  canVote = false;

  constructor() {
    effect(() => {
      this.#eventSrv.getSingleEventRating(this.eventId()).subscribe((data) => {
        this.canVote = true;
        // console.log(
        //   '🚀 ~ AddRatingComponent ~ this.#eventSrv.getSingleEventevent ~ data:',
        //   data
        // );
      });
    });
  }

  onSubmitForm(event: VoteFormInterface) {
    this.#eventSrv.insertRating(this.eventId(), event).subscribe();
    console.log('🚀 ~ AddRatingComponent ~ onSubmitForm ~ event:', event);
  }
}
