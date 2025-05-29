import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormVoteComponent } from './form-vote.component';

describe('FormVoteComponent', () => {
  let component: FormVoteComponent;
  let fixture: ComponentFixture<FormVoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormVoteComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(FormVoteComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('canVote', true);
    fixture.componentRef.setInput('isTelegramEnabled', false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
