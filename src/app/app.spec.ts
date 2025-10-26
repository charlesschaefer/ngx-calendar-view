import { Component, provideZoneChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { App } from './app';

// Mock the CalendarComponent to avoid signal initialization issues in tests
@Component({
  selector: 'app-calendar',
  standalone: true,
  template: '<div class="mock-calendar">Mock Calendar Component</div>',
})
class MockCalendarComponent {}

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideZoneChangeDetection()],
    })
      .overrideComponent(App, {
        set: {
          imports: [],
        },
      })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const titleElement = compiled.querySelector('h1');
    expect(titleElement?.textContent).toContain('ngx-calendar-view Demo');
  });
});
