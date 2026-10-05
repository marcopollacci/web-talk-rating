import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideExperimentalWebMcpForms } from '@angular/forms/signals';
import { ToastInterface } from '@common/models/toast.model';

import { FormVoteComponent } from './form-vote.component';

interface RegisteredTool {
  name: string;
  inputSchema: unknown;
  execute: (args: unknown) => Promise<{ content: { text: string }[] }>;
}

describe('FormVoteComponent', () => {
  let component: FormVoteComponent;
  let fixture: ComponentFixture<FormVoteComponent>;
  let httpTesting: HttpTestingController;
  let registeredTools: RegisteredTool[];
  let savedStates: ToastInterface[];

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
      imports: [FormVoteComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideExperimentalWebMcpForms(),
      ],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(FormVoteComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('eventId', 'abc');
    fixture.componentRef.setInput('isTelegramEnabled', false);
    savedStates = [];
    component.saved.subscribe((state) => savedStates.push(state));
    await fixture.whenStable();
  });

  afterEach(() => {
    delete (document as any).modelContext;
    httpTesting.verify();
  });

  const getTool = () => registeredTools.find((t) => t.name === 'submitTalkRating')!;

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should register the submitTalkRating WebMCP tool', () => {
    expect(getTool()).toBeDefined();
    expect(getTool().inputSchema).toEqual({
      type: 'object',
      properties: { rating: { type: 'number' }, comment: { type: 'string' } },
      required: ['rating'],
      additionalProperties: false,
    });
  });

  it('should reject an out of range rating without calling the API', async () => {
    const result = await getTool().execute({ rating: 7, comment: '' });

    expect(result.content[0].text).toContain('Form submission failed');
    expect(result.content[0].text).toContain('1 to 5');
    httpTesting.expectNone('/api/insert-rating/abc');
  });

  it('should reject a non integer rating', async () => {
    const result = await getTool().execute({ rating: 3.5, comment: '' });

    expect(result.content[0].text).toContain('Form submission failed');
    httpTesting.expectNone('/api/insert-rating/abc');
  });

  it('should submit a valid rating and reset the form', async () => {
    const pending = getTool().execute({ rating: 4, comment: 'Great talk' });

    const req = httpTesting.expectOne('/api/insert-rating/abc');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ rating: 4, comment: 'Great talk', image: null });
    req.flush({});

    const result = await pending;
    expect(result.content[0].text).toBe('Form submitted successfully.');
    expect(savedStates).toEqual([
      { type: 'success', message: 'Your feedback has been submitted.' },
    ]);
    expect(component.formRating().value()).toEqual({ rating: 0, comment: '' });
  });

  it('should default a missing comment to an empty string', async () => {
    const pending = getTool().execute({ rating: 5 });

    const req = httpTesting.expectOne('/api/insert-rating/abc');
    expect(req.request.body.comment).toBe('');
    req.flush({});
    await pending;
  });

  it('should report a server error back to the agent', async () => {
    const pending = getTool().execute({ rating: 2, comment: '' });

    httpTesting
      .expectOne('/api/insert-rating/abc')
      .flush({}, { status: 500, statusText: 'Server Error' });

    const result = await pending;
    expect(result.content[0].text).toContain('Error saving your vote');
    expect(savedStates).toEqual([{ type: 'error', message: 'Error saving your vote' }]);
  });
});
