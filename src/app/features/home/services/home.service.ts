import { Service } from '@angular/core';
import { BaseService } from '@common/services/base.service';
import { GetEvents } from '@serverModels/rating.model';

@Service()
export class HomeService extends BaseService {
  getEvents() {
    return this.httpClient.get<GetEvents>(`${this.basePath}/get-all-events`);
  }
}
