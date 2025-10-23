import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DateTime } from 'luxon';

import { CalendarComponent, CalendarEvent, CalendarProject, CalendarConfig, CalendarViewType } from "ngx-calendar-view";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CalendarComponent, CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true
})
export class App {
  protected title = 'ngx-calendar-view Demo';

  // Modal state
  showEventModal = signal(false);
  isEditing = signal(false);
  currentEvent = signal<CalendarEvent | null>(null);
  newEventData = signal<{ date: DateTime; time?: DateTime } | null>(null);

  // Form data
  eventForm = {
    title: '',
    description: '',
    project: '',
    isAllDay: false,
    time: '',
    duration: 60
  };

  // Sample data
  sampleEvents = signal<CalendarEvent[]>([
    {
      id: '1',
      title: 'Team Meeting',
      description: 'Weekly team standup',
      date: DateTime.now().startOf('day'),
      time: DateTime.now().set({ hour: 9, minute: 0 }),
      duration: 60,
      project: 'Work'
    },
    {
      id: '2',
      title: 'Lunch Break',
      description: 'Lunch with colleagues',
      date: DateTime.now().startOf('day'),
      time: DateTime.now().set({ hour: 12, minute: 30 }),
      duration: 60,
      project: 'Personal'
    },
    {
      id: '3',
      title: 'Project Review',
      description: 'Review project progress',
      date: DateTime.now().plus({ days: 1 }).startOf('day'),
      time: DateTime.now().plus({ days: 1 }).set({ hour: 14, minute: 0 }),
      duration: 90,
      project: 'Work'
    },
    {
      id: '4',
      title: 'All Day Event',
      description: 'This is an all-day event',
      date: DateTime.now().plus({ days: 2 }).startOf('day'),
      project: 'Personal'
    },
    {
      id: '5',
      title: 'Different team meeting',
      description: 'Different team meeting 2',
      date: DateTime.now().startOf('day'),
      time: DateTime.now().set({ hour: 9, minute: 30 }),
      duration: 60,
      project: 'Work'
    }
  ]);

  sampleProjects: CalendarProject[] = [
    {
      title: 'Work',
      color: '#3b82f6'
    },
    {
      title: 'Personal',
      color: '#10b981'
    },
    {
      title: 'Health',
      color: '#f59e0b'
    }
  ];

  calendarConfig: CalendarConfig = {
    defaultDuration: 60,
    defaultViewType: CalendarViewType.WEEK,
    defaultViewDate: DateTime.now(),
    showViewTypeSelector: true,
    timeSlotDuration: 30,
    maxEventsPerDay: 3,
    workingHours: {
      startHour: 9,
      startMinute: 0,
      endHour: 18,
      endMinute: 0
    }
  };

  onNewEvent(event: { date: DateTime; time?: DateTime }): void {
    this.newEventData.set(event);
    this.isEditing.set(false);
    this.currentEvent.set(null);
    this.resetForm();
    this.populateNewEventForm(event);
    this.showEventModal.set(true);
  }

  onClickEvent(event: CalendarEvent): void {
    this.currentEvent.set(event);
    this.isEditing.set(true);
    this.newEventData.set(null);
    this.populateForm(event);
    this.showEventModal.set(true);
  }

  onMoveEvent(moveData: { event: CalendarEvent; newDate: DateTime; newTime?: DateTime }): void {
    const events = this.sampleEvents();
    const eventIndex = events.findIndex(e => e.id === moveData.event.id);
    if (eventIndex !== -1) {
      const updatedEvent = {
        ...moveData.event,
        date: moveData.newDate,
        time: moveData.newTime || moveData.event.time
      };
      events[eventIndex] = updatedEvent;
      this.sampleEvents.set([...events]);
    }
  }

  // Modal methods
  closeModal(): void {
    this.showEventModal.set(false);
    this.currentEvent.set(null);
    this.newEventData.set(null);
    this.resetForm();
  }

  saveEvent(): void {
    if (!this.eventForm.title.trim()) return;

    const events = this.sampleEvents();
    
    if (this.isEditing()) {
      // Update existing event
      const eventIndex = events.findIndex(e => e.id === this.currentEvent()?.id);
      if (eventIndex !== -1) {
        const updatedEvent: CalendarEvent = {
          ...this.currentEvent()!,
          title: this.eventForm.title,
          description: this.eventForm.description,
          project: this.eventForm.project,
          duration: this.eventForm.isAllDay ? undefined : this.eventForm.duration,
          time: this.eventForm.isAllDay ? undefined : this.parseTime()
        };
        events[eventIndex] = updatedEvent;
        this.sampleEvents.set([...events]);
      }
    } else {
      // Create new event
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title: this.eventForm.title,
        description: this.eventForm.description,
        project: this.eventForm.project,
        date: this.newEventData()!.date,
        time: this.eventForm.isAllDay ? undefined : this.parseTime(),
        duration: this.eventForm.isAllDay ? undefined : this.eventForm.duration
      };
      this.sampleEvents.set([...events, newEvent]);
    }

    this.closeModal();
  }

  deleteEvent(): void {
    if (this.isEditing() && this.currentEvent()) {
      const events = this.sampleEvents();
      const filteredEvents = events.filter(e => e.id !== this.currentEvent()!.id);
      this.sampleEvents.set(filteredEvents);
      this.closeModal();
    }
  }

  private resetForm(): void {
    this.eventForm = {
      title: '',
      description: '',
      project: '',
      isAllDay: false,
      time: '',
      duration: 60
    };
  }

  private populateForm(event: CalendarEvent): void {
    this.eventForm = {
      title: event.title,
      description: event.description || '',
      project: event.project || '',
      isAllDay: !event.time,
      time: event.time ? event.time.toFormat('HH:mm') : '',
      duration: event.duration || 60
    };
  }

  private parseTime(): DateTime | undefined {
    if (!this.eventForm.time || this.eventForm.isAllDay) return undefined;
    
    const [hours, minutes] = this.eventForm.time.split(':').map(Number);
    const baseDate = this.newEventData()?.date || this.currentEvent()?.date;
    return baseDate?.set({ hour: hours, minute: minutes });
  }

  private populateNewEventForm(eventData: { date: DateTime; time?: DateTime }): void {
    if (eventData.time) {
      // If time is provided, it's a timed event
      this.eventForm.isAllDay = false;
      this.eventForm.time = eventData.time.toFormat('HH:mm');
    } else {
      // If no time is provided, it's an all-day event
      this.eventForm.isAllDay = true;
      this.eventForm.time = '';
    }
  }
}
