import { Injectable, signal, computed } from '@angular/core';
import { DateTime } from 'luxon';

import { CalendarEvent, CalendarProject, CalendarConfig, CalendarViewType } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CalendarStateService {
  // Current state signals
  private _currentDate = signal<DateTime>(DateTime.now());
  private _currentViewType = signal<CalendarViewType>(CalendarViewType.WEEK);
  private _events = signal<CalendarEvent[]>([]);
  private _projects = signal<CalendarProject[]>([]);
  private _config = signal<CalendarConfig>({});

  // Computed signals
  currentDate = computed(() => this._currentDate());
  currentViewType = computed(() => this._currentViewType());
  events = computed(() => this._events());
  projects = computed(() => this._projects());
  config = computed(() => this._config());

  // Computed derived state
  currentWeek = computed(() => {
    const date = this._currentDate();
    return {
      start: date.startOf('week'),
      end: date.endOf('week')
    };
  });

  currentMonth = computed(() => {
    const date = this._currentDate();
    return {
      start: date.startOf('month'),
      end: date.endOf('month')
    };
  });

  // State update methods
  setCurrentDate(date: DateTime): void {
    this._currentDate.set(date);
  }

  setCurrentViewType(viewType: CalendarViewType): void {
    this._currentViewType.set(viewType);
  }

  setEvents(events: CalendarEvent[]): void {
    this._events.set(events);
  }

  setProjects(projects: CalendarProject[]): void {
    this._projects.set(projects);
  }

  setConfig(config: CalendarConfig): void {
    this._config.set(config);
  }

  // Navigation methods
  navigateToPrevious(): void {
    const current = this._currentDate();
    const viewType = this._currentViewType();
    
    let newDate: DateTime;
    switch (viewType) {
      case CalendarViewType.DAY:
        newDate = current.minus({ days: 1 });
        break;
      case CalendarViewType.WEEK:
        newDate = current.minus({ weeks: 1 });
        break;
      case CalendarViewType.MONTH:
        newDate = current.minus({ months: 1 });
        break;
      default:
        newDate = current;
    }
    
    this._currentDate.set(newDate);
  }

  navigateToNext(): void {
    const current = this._currentDate();
    const viewType = this._currentViewType();
    
    let newDate: DateTime;
    switch (viewType) {
      case CalendarViewType.DAY:
        newDate = current.plus({ days: 1 });
        break;
      case CalendarViewType.WEEK:
        newDate = current.plus({ weeks: 1 });
        break;
      case CalendarViewType.MONTH:
        newDate = current.plus({ months: 1 });
        break;
      default:
        newDate = current;
    }
    
    this._currentDate.set(newDate);
  }

  navigateToToday(): void {
    this._currentDate.set(DateTime.now());
  }
}
