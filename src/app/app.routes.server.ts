import { RenderMode, ServerRoute } from '@angular/ssr';

const MOCKED_EVENTS = [
  {
    eventId: '1',
  },
];

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
