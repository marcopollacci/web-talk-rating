import { Injectable } from '@angular/core';
import { BaseService } from '@common/services/base.service';
import { GetAllEventsRatingResponse } from '@serverModels/rating.model';

@Injectable({
  providedIn: 'root',
})
export class EventService extends BaseService {
  #getAllEventsRatingPath = `${this.basePath}/get-all-events-rating`;

  getSingleEventevent(event: string) {
    return this.httpClient.get<GetAllEventsRatingResponse[]>(
      this.#getAllEventsRatingPath,
      {
        params: { event },
      }
    );
  }
}
