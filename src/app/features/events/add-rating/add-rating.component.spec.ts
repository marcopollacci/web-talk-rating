import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideExperimentalWebMcpForms } from '@angular/forms/signals';
import { AddRatingComponent } from './add-rating.component';

interface RegisteredTool {
  name: string;
  execute: (args: unknown) => { content: { text: string }[] };
}

describe('AddRatingComponent', () => {
  let component: AddRatingComponent;
  let fixture: ComponentFixture<AddRatingComponent>;
  let httpTesting: HttpTestingController;
  let registeredTools: RegisteredTool[];

  beforeEach(async () => {
    const tools: RegisteredTool[] = (registeredTools = []);
    // minimal WebMCP mock: honours the AbortSignal Angular uses to unregister tools
    (document as any).modelContext = {
      registerTool: (tool: RegisteredTool, { signal }: { signal: AbortSignal }) => {
        if (signal.aborted) return;
        tools.push(tool);
        signal.addEventListener('abort', () => tools.splice(tools.indexOf(tool), 1));
      },
    };

    await TestBed.configureTestingModule({
      imports: [AddRatingComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideExperimentalWebMcpForms(),
      ],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(AddRatingComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('eventId', 'abc');
    fixture.detectChanges();
  });

  afterEach(() => {
    delete (document as any).modelContext;
  });

  const getTalkDetails = () =>
    registeredTools.find((t) => t.name === 'getTalkDetails')!;

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose talk details through the getTalkDetails WebMCP tool', async () => {
    expect(getTalkDetails().execute({}).content[0].text).toContain('still loading');

    httpTesting.expectOne('/api/get-event/abc').flush({
      name_event: 'NG Conf',
      talk: 'WebMCP in Angular',
      description: 'desc',
      date_event_from: '2026-10-01',
      date_event_to: '2026-10-02',
      vote_enabled: true,
      url_image: '',
    });
    await fixture.whenStable();

    expect(JSON.parse(getTalkDetails().execute({}).content[0].text)).toEqual({
      event: 'NG Conf',
      talk: 'WebMCP in Angular',
      description: 'desc',
      from: '2026-10-01',
      to: '2026-10-02',
      votingOpen: true,
    });
    expect(registeredTools.some((t) => t.name === 'submitTalkRating')).toBeTrue();
  });

  it('should not expose submitTalkRating when voting is closed', async () => {
    httpTesting.expectOne('/api/get-event/abc').flush({
      name_event: 'NG Conf',
      talk: 'WebMCP in Angular',
      description: 'desc',
      date_event_from: '2026-10-01',
      date_event_to: '2026-10-02',
      vote_enabled: false,
      url_image: '',
    });
    await fixture.whenStable();

    expect(registeredTools.some((t) => t.name === 'submitTalkRating')).toBeFalse();
  });
});
