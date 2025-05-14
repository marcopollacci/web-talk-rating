import { Injectable } from '@angular/core';
import { BaseService } from '@common/services/base.service';
import { GetEvents } from '@serverModels/rating.model';

@Injectable({
  providedIn: 'root',
})
export class HomeService extends BaseService {
  getEvents() {
    return this.httpClient.get<GetEvents>(`${this.basePath}/get-all-events`);
  }
}
