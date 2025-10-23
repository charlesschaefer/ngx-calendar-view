import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';

import { CalendarEvent, CalendarViewType, WorkingHours } from '../models';

export interface TimeSlot {
  time: DateTime;
  label: string;
}

export interface EventPosition {
  top: number;
  left: number;
  width: number;
  height: number;
  zIndex: number;
}

@Injectable({
  providedIn: 'root'
})
export class CalendarUtilsService {

  generateTimeSlots(slotDuration = 30, workingHours?: WorkingHours): TimeSlot[] {
    const slots: TimeSlot[] = [];
    
    // Default to 24-hour view if no working hours specified
    const startHour = workingHours?.startHour ?? 0;
    const startMinute = workingHours?.startMinute ?? 0;
    const endHour = workingHours?.endHour ?? 24;
    const endMinute = workingHours?.endMinute ?? 0;

    // Calculate start and end times in minutes from midnight
    const startTimeMinutes = startHour * 60 + startMinute;
    const endTimeMinutes = endHour * 60 + endMinute;

    // Generate slots within the working hours range
    for (let totalMinutes = startTimeMinutes; totalMinutes < endTimeMinutes; totalMinutes += slotDuration) {
      const hour = Math.floor(totalMinutes / 60);
      const minute = totalMinutes % 60;
      
      // Skip if we've gone beyond 23:59
      if (hour >= 24) break;
      
      const time = DateTime.fromObject({ hour, minute });
      slots.push({
        time,
        label: time.toFormat('HH:mm')
      });
    }

    return slots;
  }

  getEventsForDate(events: CalendarEvent[], date: DateTime): CalendarEvent[] {
    return events.filter(event => {
      const eventDate = event.time || event.date;
      return eventDate.hasSame(date, 'day');
    });
  }

  getEventsForWeek(events: CalendarEvent[], weekStart: DateTime): CalendarEvent[] {
    const weekEnd = weekStart.plus({ days: 6 });
    return events.filter(event => {
      const eventDate = event.time || event.date;
      return eventDate >= weekStart && eventDate <= weekEnd;
    });
  }

  getEventsForMonth(events: CalendarEvent[], monthStart: DateTime): CalendarEvent[] {
    const monthEnd = monthStart.endOf('month');
    return events.filter(event => {
      const eventDate = event.time || event.date;
      return eventDate >= monthStart && eventDate <= monthEnd;
    });
  }

  calculateEventPosition(event: CalendarEvent, slotDuration = 30): EventPosition {
    const eventTime = event.time || event.date;
    const duration = event.duration || 60; // default 1 hour

    // Calculate position based on time
    const hour = eventTime.hour;
    const minute = eventTime.minute;
    const totalMinutes = hour * 60 + minute;

    const top = (totalMinutes / slotDuration) * 2; // 2rem per slot
    const height = (duration / slotDuration) * 2; // 2rem per slot

    return {
      top,
      left: 0,
      width: 100,
      height,
      zIndex: 1
    };
  }

  calculateOverlappingEvents(events: CalendarEvent[], slotDuration = 30): Map<string, EventPosition[]> {
    const eventPositions = new Map<string, EventPosition[]>();

    // Sort events by start time
    const sortedEvents = [...events].sort((a, b) => {
      const timeA = a.time || a.date;
      const timeB = b.time || b.date;
      return timeA.toMillis() - timeB.toMillis();
    });

    const columns: CalendarEvent[][] = [];

    for (const event of sortedEvents) {
      let placed = false;

      // Try to place in existing column
      for (const column of columns) {
        const lastEvent = column[column.length - 1];

        if (this.canPlaceEvent(event, lastEvent)) {
          column.push(event);
          placed = true;
          break;
        }
      }

      // Create new column if couldn't place
      if (!placed) {
        columns.push([event]);
      }
    }

    // Calculate positions for each event
    for (let colIndex = 0; colIndex < columns.length; colIndex++) {
      const column = columns[colIndex];
      const columnWidth = 100 / columns.length;

      for (const event of column) {
        const basePosition = this.calculateEventPosition(event, slotDuration);
        const position: EventPosition = {
          ...basePosition,
          left: colIndex * columnWidth,
          width: columnWidth,
          zIndex: colIndex + 1
        };

        if (!eventPositions.has(event.id)) {
          eventPositions.set(event.id, []);
        }
        eventPositions.get(event.id)!.push(position);
      }
    }

    return eventPositions;
  }

  private canPlaceEvent(newEvent: CalendarEvent, lastEvent: CalendarEvent): boolean {
    const newEventTime = newEvent.time || newEvent.date;
    const lastEventTime = lastEvent.time || lastEvent.date;
    const lastEventDuration = lastEvent.duration || 60;

    const lastEventEnd = lastEventTime.plus({ minutes: lastEventDuration });

    return newEventTime >= lastEventEnd;
  }

  generateMonthDays(monthStart: DateTime): DateTime[] {
    const days: DateTime[] = [];
    const startOfMonth = monthStart.startOf('month');

    // Start from the beginning of the week containing the first day of the month
    const startDate = startOfMonth.startOf('week');

    // Generate 42 days (6 weeks) to ensure we cover the entire month
    for (let i = 0; i < 42; i++) {
      days.push(startDate.plus({ days: i }));
    }

    return days;
  }

  formatDateForDisplay(date: DateTime, viewType: CalendarViewType): string {
    switch (viewType) {
      case CalendarViewType.DAY:
        return date.toFormat('EEEE, MMMM d, yyyy');
      case CalendarViewType.WEEK:
        return `${date.startOf('week').toFormat('MMM d')} - ${date.endOf('week').toFormat('MMM d, yyyy')}`;
      case CalendarViewType.MONTH:
        return date.toFormat('MMMM yyyy');
      default:
        return date.toFormat('MMMM d, yyyy');
    }
  }

  isToday(date: DateTime): boolean {
    return date.hasSame(DateTime.now(), 'day');
  }

  isCurrentMonth(date: DateTime, currentMonth: DateTime): boolean {
    return date.hasSame(currentMonth, 'month');
  }
}
