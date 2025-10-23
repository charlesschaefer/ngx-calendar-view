import { TestBed } from '@angular/core/testing';
import { DateTime } from 'luxon';

import { CalendarUtilsService } from './calendar-utils.service';
import { CalendarEvent, CalendarViewType, WorkingHours } from '../models';

describe('CalendarUtilsService', () => {
  let service: CalendarUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalendarUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('generateTimeSlots', () => {
    it('should generate time slots with default 30-minute duration', () => {
      const slots = service.generateTimeSlots();
      
      expect(slots.length).toBeGreaterThan(0);
      expect(slots[0].time.hour).toBe(0);
      expect(slots[0].time.minute).toBe(0);
      expect(slots[0].label).toBe('00:00');
    });

    it('should generate time slots with custom duration', () => {
      const slots = service.generateTimeSlots(60); // 1-hour slots
      
      expect(slots.length).toBeGreaterThan(0);
      // Check that slots are 1 hour apart
      if (slots.length > 1) {
        const diff = slots[1].time.diff(slots[0].time, 'minutes').minutes;
        expect(diff).toBe(60);
      }
    });

    it('should generate time slots within working hours', () => {
      const workingHours: WorkingHours = {
        startHour: 9,
        startMinute: 0,
        endHour: 17,
        endMinute: 0
      };
      
      const slots = service.generateTimeSlots(30, workingHours);
      
      expect(slots.length).toBeGreaterThan(0);
      expect(slots[0].time.hour).toBe(9);
      expect(slots[0].time.minute).toBe(0);
      
      const lastSlot = slots[slots.length - 1];
      expect(lastSlot.time.hour).toBeLessThan(17);
    });

    it('should format time labels correctly', () => {
      const slots = service.generateTimeSlots(30);
      
      slots.forEach(slot => {
        expect(slot.label).toMatch(/^\d{2}:\d{2}$/);
      });
    });

    it('should handle 24-hour view when no working hours specified', () => {
      const slots = service.generateTimeSlots(60);
      
      // Should generate slots from 00:00 to 23:00
      expect(slots.length).toBe(24);
      expect(slots[0].time.hour).toBe(0);
      expect(slots[23].time.hour).toBe(23);
    });
  });

  describe('getEventsForDate', () => {
    const testEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'Event 1',
        date: DateTime.fromISO('2024-01-15'),
        time: DateTime.fromISO('2024-01-15T10:00:00')
      },
      {
        id: '2',
        title: 'Event 2',
        date: DateTime.fromISO('2024-01-16'),
        time: DateTime.fromISO('2024-01-16T14:00:00')
      },
      {
        id: '3',
        title: 'All Day Event',
        date: DateTime.fromISO('2024-01-15')
      }
    ];

    it('should return events for a specific date', () => {
      const targetDate = DateTime.fromISO('2024-01-15');
      const events = service.getEventsForDate(testEvents, targetDate);
      
      expect(events.length).toBe(2);
      expect(events.map(e => e.id)).toContain('1');
      expect(events.map(e => e.id)).toContain('3');
    });

    it('should return empty array when no events for date', () => {
      const targetDate = DateTime.fromISO('2024-01-20');
      const events = service.getEventsForDate(testEvents, targetDate);
      
      expect(events).toEqual([]);
    });

    it('should handle events with only date (no time)', () => {
      const allDayEvent: CalendarEvent = {
        id: '4',
        title: 'All Day',
        date: DateTime.fromISO('2024-01-15')
      };
      
      const events = service.getEventsForDate([allDayEvent], DateTime.fromISO('2024-01-15'));
      expect(events.length).toBe(1);
      expect(events[0].id).toBe('4');
    });
  });

  describe('getEventsForWeek', () => {
    const testEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'Monday Event',
        date: DateTime.fromISO('2024-01-15'), // Monday
        time: DateTime.fromISO('2024-01-15T10:00:00')
      },
      {
        id: '2',
        title: 'Friday Event',
        date: DateTime.fromISO('2024-01-19'), // Friday
        time: DateTime.fromISO('2024-01-19T14:00:00')
      },
      {
        id: '3',
        title: 'Next Week Event',
        date: DateTime.fromISO('2024-01-22'), // Next Monday
        time: DateTime.fromISO('2024-01-22T09:00:00')
      }
    ];

    it('should return events within a week', () => {
      const weekStart = DateTime.fromISO('2024-01-15'); // Monday
      const events = service.getEventsForWeek(testEvents, weekStart);
      
      expect(events.length).toBe(2);
      expect(events.map(e => e.id)).toContain('1');
      expect(events.map(e => e.id)).toContain('2');
    });

    it('should return empty array when no events in week', () => {
      const weekStart = DateTime.fromISO('2024-02-15');
      const events = service.getEventsForWeek(testEvents, weekStart);
      
      expect(events).toEqual([]);
    });
  });

  describe('getEventsForMonth', () => {
    const testEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'January Event',
        date: DateTime.fromISO('2024-01-15'),
        time: DateTime.fromISO('2024-01-15T10:00:00')
      },
      {
        id: '2',
        title: 'February Event',
        date: DateTime.fromISO('2024-02-15'),
        time: DateTime.fromISO('2024-02-15T14:00:00')
      }
    ];

    it('should return events within a month', () => {
      const monthStart = DateTime.fromISO('2024-01-01');
      const events = service.getEventsForMonth(testEvents, monthStart);
      
      expect(events.length).toBe(1);
      expect(events[0].id).toBe('1');
    });

    it('should return empty array when no events in month', () => {
      const monthStart = DateTime.fromISO('2024-03-01');
      const events = service.getEventsForMonth(testEvents, monthStart);
      
      expect(events).toEqual([]);
    });
  });

  describe('calculateEventPosition', () => {
    it('should calculate position for timed event', () => {
      const event: CalendarEvent = {
        id: '1',
        title: 'Test Event',
        date: DateTime.fromISO('2024-01-15'),
        time: DateTime.fromISO('2024-01-15T10:00:00'),
        duration: 60
      };
      
      const position = service.calculateEventPosition(event, 30);
      
      expect(position.top).toBe(40); // 10:00 = 600 minutes / 30 * 2 = 40
      expect(position.height).toBe(4); // 60 minutes / 30 * 2 = 4
      expect(position.left).toBe(0);
      expect(position.width).toBe(100);
      expect(position.zIndex).toBe(1);
    });

    it('should calculate position for all-day event', () => {
      const event: CalendarEvent = {
        id: '1',
        title: 'All Day Event',
        date: DateTime.fromISO('2024-01-15')
      };
      
      const position = service.calculateEventPosition(event, 30);
      
      expect(position.top).toBe(0);
      expect(position.height).toBe(4); // Default 60 minutes
      expect(position.left).toBe(0);
      expect(position.width).toBe(100);
    });

    it('should handle custom duration', () => {
      const event: CalendarEvent = {
        id: '1',
        title: 'Test Event',
        date: DateTime.fromISO('2024-01-15'),
        time: DateTime.fromISO('2024-01-15T09:00:00'),
        duration: 120
      };
      
      const position = service.calculateEventPosition(event, 30);
      
      expect(position.height).toBe(8); // 120 minutes / 30 * 2 = 8
    });
  });

  describe('calculateOverlappingEvents', () => {
    const overlappingEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'Event 1',
        date: DateTime.fromISO('2024-01-15'),
        time: DateTime.fromISO('2024-01-15T10:00:00'),
        duration: 60
      },
      {
        id: '2',
        title: 'Event 2',
        date: DateTime.fromISO('2024-01-15'),
        time: DateTime.fromISO('2024-01-15T10:30:00'),
        duration: 60
      },
      {
        id: '3',
        title: 'Event 3',
        date: DateTime.fromISO('2024-01-15'),
        time: DateTime.fromISO('2024-01-15T11:00:00'),
        duration: 60
      }
    ];

    it('should calculate positions for overlapping events', () => {
      const positions = service.calculateOverlappingEvents(overlappingEvents, 30);
      
      expect(positions.size).toBe(3);
      expect(positions.has('1')).toBe(true);
      expect(positions.has('2')).toBe(true);
      expect(positions.has('3')).toBe(true);
    });

    it('should handle non-overlapping events', () => {
      const nonOverlappingEvents: CalendarEvent[] = [
        {
          id: '1',
          title: 'Event 1',
          date: DateTime.fromISO('2024-01-15'),
          time: DateTime.fromISO('2024-01-15T10:00:00'),
          duration: 60
        },
        {
          id: '2',
          title: 'Event 2',
          date: DateTime.fromISO('2024-01-15'),
          time: DateTime.fromISO('2024-01-15T12:00:00'),
          duration: 60
        }
      ];
      
      const positions = service.calculateOverlappingEvents(nonOverlappingEvents, 30);
      
      expect(positions.size).toBe(2);
    });
  });

  describe('generateMonthDays', () => {
    it('should generate 42 days for a month', () => {
      const monthStart = DateTime.fromISO('2024-01-01');
      const days = service.generateMonthDays(monthStart);
      
      expect(days.length).toBe(42);
    });

    it('should start from beginning of week containing first day', () => {
      const monthStart = DateTime.fromISO('2024-01-01'); // Monday
      const days = service.generateMonthDays(monthStart);
      
      // First day should be the Monday of the week containing Jan 1
      const firstDay = days[0];
      expect(firstDay.weekday).toBe(1); // Monday
    });

    it('should include all days of the month', () => {
      const monthStart = DateTime.fromISO('2024-01-01');
      const days = service.generateMonthDays(monthStart);
      
      // Find January days
      const januaryDays = days.filter(day => day.month === 1);
      expect(januaryDays.length).toBe(31); // January has 31 days
    });
  });

  describe('formatDateForDisplay', () => {
    const testDate = DateTime.fromISO('2024-01-15');

    it('should format date for DAY view', () => {
      const formatted = service.formatDateForDisplay(testDate, CalendarViewType.DAY);
      expect(formatted).toContain('Monday');
      expect(formatted).toContain('January');
      expect(formatted).toContain('15');
      expect(formatted).toContain('2024');
    });

    it('should format date for WEEK view', () => {
      const formatted = service.formatDateForDisplay(testDate, CalendarViewType.WEEK);
      expect(formatted).toContain('Jan');
      expect(formatted).toContain('15');
    });

    it('should format date for MONTH view', () => {
      const formatted = service.formatDateForDisplay(testDate, CalendarViewType.MONTH);
      expect(formatted).toBe('January 2024');
    });
  });

  describe('isToday', () => {
    it('should return true for today', () => {
      const today = DateTime.now();
      expect(service.isToday(today)).toBe(true);
    });

    it('should return false for yesterday', () => {
      const yesterday = DateTime.now().minus({ days: 1 });
      expect(service.isToday(yesterday)).toBe(false);
    });

    it('should return false for tomorrow', () => {
      const tomorrow = DateTime.now().plus({ days: 1 });
      expect(service.isToday(tomorrow)).toBe(false);
    });
  });

  describe('isCurrentMonth', () => {
    const currentMonth = DateTime.fromISO('2024-01-15');

    it('should return true for same month', () => {
      const sameMonth = DateTime.fromISO('2024-01-20');
      expect(service.isCurrentMonth(sameMonth, currentMonth)).toBe(true);
    });

    it('should return false for different month', () => {
      const differentMonth = DateTime.fromISO('2024-02-15');
      expect(service.isCurrentMonth(differentMonth, currentMonth)).toBe(false);
    });

    it('should return false for different year', () => {
      const differentYear = DateTime.fromISO('2023-01-15');
      expect(service.isCurrentMonth(differentYear, currentMonth)).toBe(false);
    });
  });
});
