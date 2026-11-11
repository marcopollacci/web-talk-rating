import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, PLATFORM_ID, Service } from '@angular/core';
import { ENABLE_UPLOAD_PHOTO, PORT_RUNNING } from '@common/env/ssr';

@Service()
export class BaseService {
  readonly httpClient = inject(HttpClient);
  readonly #apiBaseUrl = isPlatformServer(inject(PLATFORM_ID))
    ? `http://localhost:${PORT_RUNNING}/api` // server call
    : '/api'; // from end client (browser)

  get basePath() {
    return this.#apiBaseUrl;
  }

  get isTelegramBotEnabled() {
    return ENABLE_UPLOAD_PHOTO;
  }
}
