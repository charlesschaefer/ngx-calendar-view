import { TestBed } from '@angular/core/testing';
import { DateTime } from 'luxon';

import { CalendarStateService } from './calendar-state.service';
import { CalendarEvent, CalendarProject, CalendarConfig, CalendarViewType } from '../models';

describe('CalendarStateService', () => {
  let service: CalendarStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalendarStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should initialize with current date as today', () => {
      const today = DateTime.now();
      const currentDate = service.currentDate();
      
      expect(currentDate.hasSame(today, 'day')).toBe(true);
    });

    it('should initialize with WEEK as default view type', () => {
      expect(service.currentViewType()).toBe(CalendarViewType.WEEK);
    });

    it('should initialize with empty events array', () => {
      expect(service.events()).toEqual([]);
    });

    it('should initialize with empty projects array', () => {
      expect(service.projects()).toEqual([]);
    });

    it('should initialize with empty config object', () => {
      expect(service.config()).toEqual({});
    });
  });

  describe('Current Week Computation', () => {
    it('should compute current week correctly', () => {
      const testDate = DateTime.fromISO('2024-01-15'); // Monday
      service.setCurrentDate(testDate);
      
      const currentWeek = service.currentWeek();
      
      expect(currentWeek.start.weekday).toBe(1); // Monday
      expect(currentWeek.end.weekday).toBe(7); // Sunday
      expect(currentWeek.start.hasSame(testDate, 'week')).toBe(true);
      expect(currentWeek.end.hasSame(testDate, 'week')).toBe(true);
    });
  });

  describe('Current Month Computation', () => {
    it('should compute current month correctly', () => {
      const testDate = DateTime.fromISO('2024-01-15');
      service.setCurrentDate(testDate);
      
      const currentMonth = service.currentMonth();
      
      expect(currentMonth.start.day).toBe(1);
      expect(currentMonth.end.day).toBe(31); // January has 31 days
      expect(currentMonth.start.hasSame(testDate, 'month')).toBe(true);
      expect(currentMonth.end.hasSame(testDate, 'month')).toBe(true);
    });
  });

  describe('State Updates', () => {
    it('should update current date', () => {
      const newDate = DateTime.fromISO('2024-02-15');
      service.setCurrentDate(newDate);
      
      expect(service.currentDate()).toEqual(newDate);
    });

    it('should update current view type', () => {
      service.setCurrentViewType(CalendarViewType.MONTH);
      
      expect(service.currentViewType()).toBe(CalendarViewType.MONTH);
    });

    it('should update events', () => {
      const events: CalendarEvent[] = [
        {
          id: '1',
          title: 'Test Event',
          date: DateTime.now(),
          time: DateTime.now().set({ hour: 10, minute: 0 })
        }
      ];
      
      service.setEvents(events);
      
      expect(service.events()).toEqual(events);
    });

    it('should update projects', () => {
      const projects: CalendarProject[] = [
        { title: 'Work', color: '#3b82f6' },
        { title: 'Personal', color: '#10b981' }
      ];
      
      service.setProjects(projects);
      
      expect(service.projects()).toEqual(projects);
    });

    it('should update config', () => {
      const config: CalendarConfig = {
        defaultDuration: 90,
        defaultViewType: CalendarViewType.DAY,
        showViewTypeSelector: false
      };
      
      service.setConfig(config);
      
      expect(service.config()).toEqual(config);
    });
  });

  describe('Navigation Methods', () => {
    beforeEach(() => {
      service.setCurrentDate(DateTime.fromISO('2024-01-15')); // Monday
    });

    describe('navigateToPrevious', () => {
      it('should navigate to previous day when in DAY view', () => {
        service.setCurrentViewType(CalendarViewType.DAY);
        const initialDate = service.currentDate();
        
        service.navigateToPrevious();
        
        const newDate = service.currentDate();
        expect(newDate).toEqual(initialDate.minus({ days: 1 }));
      });

      it('should navigate to previous week when in WEEK view', () => {
        service.setCurrentViewType(CalendarViewType.WEEK);
        const initialDate = service.currentDate();
        
        service.navigateToPrevious();
        
        const newDate = service.currentDate();
        expect(newDate).toEqual(initialDate.minus({ weeks: 1 }));
      });

      it('should navigate to previous month when in MONTH view', () => {
        service.setCurrentViewType(CalendarViewType.MONTH);
        const initialDate = service.currentDate();
        
        service.navigateToPrevious();
        
        const newDate = service.currentDate();
        expect(newDate).toEqual(initialDate.minus({ months: 1 }));
      });
    });

    describe('navigateToNext', () => {
      it('should navigate to next day when in DAY view', () => {
        service.setCurrentViewType(CalendarViewType.DAY);
        const initialDate = service.currentDate();
        
        service.navigateToNext();
        
        const newDate = service.currentDate();
        expect(newDate).toEqual(initialDate.plus({ days: 1 }));
      });

      it('should navigate to next week when in WEEK view', () => {
        service.setCurrentViewType(CalendarViewType.WEEK);
        const initialDate = service.currentDate();
        
        service.navigateToNext();
        
        const newDate = service.currentDate();
        expect(newDate).toEqual(initialDate.plus({ weeks: 1 }));
      });

      it('should navigate to next month when in MONTH view', () => {
        service.setCurrentViewType(CalendarViewType.MONTH);
        const initialDate = service.currentDate();
        
        service.navigateToNext();
        
        const newDate = service.currentDate();
        expect(newDate).toEqual(initialDate.plus({ months: 1 }));
      });
    });

    describe('navigateToToday', () => {
      it('should navigate to today', () => {
        const today = DateTime.now();
        
        service.navigateToToday();
        
        const currentDate = service.currentDate();
        expect(currentDate.hasSame(today, 'day')).toBe(true);
      });
    });
  });

  describe('Signal Reactivity', () => {
    it('should update computed signals when underlying signals change', () => {
      const newDate = DateTime.fromISO('2024-03-15');
      const newViewType = CalendarViewType.MONTH;
      
      service.setCurrentDate(newDate);
      service.setCurrentViewType(newViewType);
      
      expect(service.currentDate()).toEqual(newDate);
      expect(service.currentViewType()).toBe(newViewType);
      
      // Verify computed signals are updated
      const currentWeek = service.currentWeek();
      expect(currentWeek.start.hasSame(newDate, 'week')).toBe(true);
      
      const currentMonth = service.currentMonth();
      expect(currentMonth.start.hasSame(newDate, 'month')).toBe(true);
    });
  });
});
