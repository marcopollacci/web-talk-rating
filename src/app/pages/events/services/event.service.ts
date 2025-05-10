import { Injectable } from '@angular/core';
import { BaseService } from '@common/services/base.service';
import {
  GetAllEventsRatingResponse,
  GetSingleEventResponse,
} from '@serverModels/rating.model';
import { VoteFormInterface } from '../models/vote.model';

@Injectable({
  providedIn: 'root',
})
export class EventService extends BaseService {
  getSingleEventRating(event: string) {
    return this.httpClient.get<GetAllEventsRatingResponse[]>(
      `${this.basePath}/get-all-events-rating`,
      {
        params: { event },
      }
    );
  }

  getEventForRating(event: string) {
    return this.httpClient.get<GetSingleEventResponse>(
      `${this.basePath}/get-event/${event}`
    );
  }

  insertRating(eventId: string, formData: VoteFormInterface) {
    return this.httpClient.post(
      `${this.basePath}/insert-rating/${eventId}`,
      formData
    );
  }
}
