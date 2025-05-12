import { RenderMode, ServerRoute } from '@angular/ssr';

const MOCKED_EVENTS = [
  {
    eventId: '1',
  },
];

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'events/add-rating/:eventId',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return MOCKED_EVENTS;
    },
  },
];
