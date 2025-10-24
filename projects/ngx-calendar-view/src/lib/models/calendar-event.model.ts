import { DateTime } from 'luxon';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: DateTime;
  time?: DateTime;
  duration?: number; // in minutes
  project?: string;
  recurrenceType?: CalendarRecurrenceType;
}

export interface CalendarProject {
  title: string;
  color?: string;
}

export interface WorkingHours {
  startHour: number; // 0-23
  startMinute: number; // 0-59
  endHour: number; // 0-23
  endMinute: number; // 0-59
}

export interface CalendarConfig {
  defaultDuration?: number; // in minutes
  defaultViewType?: CalendarViewType;
  defaultViewDate?: DateTime;
  showViewTypeSelector?: boolean;
  timeSlotDuration?: number; // in minutes (15, 30, 60)
  maxEventsPerDay?: number; // for month view stacking
  workingHours?: WorkingHours; // defines start and end working time
}

export enum CalendarViewType {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month'
}

export enum CalendarRecurrenceType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  WEEKDAY = 'weekday',
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

export interface CalendarOutputs {
  newEvent: {
    date: DateTime;
    time?: DateTime;
  };
  clickEvent: CalendarEvent;
  moveEvent: {
    event: CalendarEvent;
    newDate: DateTime;
    newTime?: DateTime;
  };
}
