import { NgOptimizedImage } from '@angular/common';
import {
  Component,
  declareExperimentalWebMcpTool,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
  ChangeDetectionStrategy
} from '@angular/core';
import { ToastInterface } from '@common/models/toast.model';
import { GetSingleEventResponse } from '@serverModels/rating.model';
import { catchError, of } from 'rxjs';
import { ToastComponent } from '../../../common/components/toast/toast.component';
import { EventService } from '../services/event.service';
import { FormVoteComponent } from './components/form-vote/form-vote.component';

@Component({
  selector: 'app-add-rating',
  imports: [FormVoteComponent, NgOptimizedImage, ToastComponent],
  templateUrl: './add-rating.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './add-rating.component.scss',
})
export class AddRatingComponent {
  #eventSrv = inject(EventService);
  eventId = input.required<string>();
  canVote = signal<boolean>(false);
  noEventFound = signal<boolean>(false);
  eventData = signal<GetSingleEventResponse | null>(null);
  stateSave = signal<ToastInterface | null>(null);
  isTelegramEnabled = this.#eventSrv.isTelegramBotEnabled;
  dialog = viewChild<ElementRef>('dialog');

  constructor() {
    effect(() => {
      this.searchEvent(this.eventId());
    });

    declareExperimentalWebMcpTool({
      name: 'getTalkDetails',
      description:
        'Returns the event and talk being rated on this page, and whether voting is currently open.',
      inputSchema: { type: 'object', properties: {} },
      annotations: { readOnlyHint: true },
      execute: () => ({
        content: [{ type: 'text', text: this.#getTalkDetails() }],
      }),
    });
  }

  searchEvent(eventId: string) {
    this.noEventFound.set(false);
    this.#eventSrv
      .getEventForRating(eventId)
      .pipe(
        catchError((error: unknown) => {
          console.error('🚀 ~ AddRatingComponent ~ catchError ~ error:', error);
          return of(null);
        })
      )
      .subscribe((data) => {
        if (!data) {
          this.noEventFound.set(true);
          return;
        }
        this.eventData.set(data);
        this.canVote.set(data.vote_enabled);
      });
  }

  onSaved(state: ToastInterface) {
    this.stateSave.set(state);
    (this.dialog()!.nativeElement as HTMLDialogElement).showModal();
  }

  #getTalkDetails(): string {
    const event = this.eventData();
    if (event) {
      return JSON.stringify({
        event: event.name_event,
        talk: event.talk,
        description: event.description,
        from: event.date_event_from,
        to: event.date_event_to,
        votingOpen: event.vote_enabled,
      });
    }
    return this.noEventFound()
      ? 'No event found for this page.'
      : 'Event details are still loading, retry shortly.';
  }
}
