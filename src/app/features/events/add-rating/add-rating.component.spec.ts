import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { AddRatingComponent } from './add-rating.component';

describe('AddRatingComponent', () => {
  let component: AddRatingComponent;
  let fixture: ComponentFixture<AddRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRatingComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideHttpClient(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddRatingComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('eventId', 1);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
