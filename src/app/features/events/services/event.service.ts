import { Injectable } from '@angular/core';
import { BaseService } from '@common/services/base.service';
import { GetSingleEventResponse } from '@serverModels/rating.model';
import { VoteFormInterface } from '../models/vote.model';

@Injectable({
  providedIn: 'root',
})
export class EventService extends BaseService {
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
