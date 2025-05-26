import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ENABLE_TELEGRAM_API, PORT_RUNNING } from '@common/env/ssr';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  readonly httpClient = inject(HttpClient);
  #apiBaseUrl: string;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    const isServer = isPlatformServer(platformId);

    this.#apiBaseUrl = isServer
      ? `http://localhost:${PORT_RUNNING}/api` // server call
      : '/api'; // from end client (browser)
  }

  get basePath() {
    return this.#apiBaseUrl;
  }

  get isTelegramBotEnabled() {
    return ENABLE_TELEGRAM_API;
  }
}
