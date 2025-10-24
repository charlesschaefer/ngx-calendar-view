import { Component, input, output, OnInit, OnDestroy, ChangeDetectionStrategy, inject, computed, signal, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateTime } from 'luxon';


import { CalendarEvent, CalendarProject, CalendarConfig, CalendarViewType } from './models';
import { CalendarStateService, CalendarUtilsService, ColorGeneratorService, DragDropService, GestureService } from './services';


const EVENT_CARD_OPACITY_HEX = '99';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ngx-calendar',
  imports: [CommonModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit, OnDestroy, AfterViewInit {
  // Inputs
  events = input<CalendarEvent[]>([]);
  projects = input<CalendarProject[]>([]);
  config = input<CalendarConfig>({});

  // Outputs
  newEvent = output<{ date: DateTime; time?: DateTime }>();
  clickEvent = output<CalendarEvent>();
  moveEvent = output<{ event: CalendarEvent; newDate: DateTime; newTime?: DateTime }>();

  // Services
  private calendarState = inject(CalendarStateService);
  private calendarUtils = inject(CalendarUtilsService);
  private colorGenerator = inject(ColorGeneratorService);
  private dragDropService = inject(DragDropService);
  private gestureService = inject(GestureService);
  private elementRef = inject(ElementRef);

  // Component state
  private isDestroyed = signal(false);
  private popoverEvent = signal<CalendarEvent | null>(null);
  private popoverPosition = signal<{ x: number, y: number } | null>(null);
  
  // Computed properties
  currentDate = computed(() => this.calendarState.currentDate());
  currentViewType = computed(() => this.calendarState.currentViewType());
  
  // Drag state
  dragState = computed(() => this.dragDropService.getDragState());
  
  // View types
  viewTypes = Object.values(CalendarViewType);
  CalendarViewType = CalendarViewType; // Make enum available in template
  dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Computed data
  timeSlots = computed(() => {
    const slotDuration = this.config().timeSlotDuration || 30;
    const workingHours = this.config().workingHours;
    return this.calendarUtils.generateTimeSlots(slotDuration, workingHours);
  });

  weekDays = computed(() => {
    const current = this.currentDate();
    const weekStart = current.startOf('week');
    const days: DateTime[] = [];
    for (let i = 0; i < 7; i++) {
      days.push(weekStart.plus({ days: i }));
    }
    return days;
  });

  monthDays = computed(() => {
    return this.calendarUtils.generateMonthDays(this.currentDate());
  });

  monthOptions = computed(() => {
    const current = this.currentDate();
    const options: { value: string | null; label: string }[] = [];
    for (let i = -6; i <= 6; i++) {
      const month = current.plus({ months: i });
      options.push({
        value: month.toISODate(),
        label: month.toFormat('MMMM yyyy')
      });
    }
    return options;
  });

  // Check if any day in the week has all-day events
  hasAllDayEventsInWeek = computed(() => {
    return this.weekDays().some(day => this.getAllDayEvents(day).length > 0);
  });

  // Get the maximum number of all-day events in the current week
  maxAllDayEventsInWeek = computed(() => {
    const weekDays = this.weekDays();
    let maxEvents = 0;
    
    for (const day of weekDays) {
      const allDayEventsCount = this.getAllDayEvents(day).length;
      maxEvents = Math.max(maxEvents, allDayEventsCount);
    }
    
    return maxEvents;
  });

  // Calculate the height for all-day rows based on max events
  getAllDayRowHeight(): string {
    const maxEvents = this.maxAllDayEventsInWeek();
    if (maxEvents === 0) return '2rem'; // Minimum height when no events
    
    // Each event takes approximately 1.5rem + 0.25rem margin
    // Add some padding for the container
    const eventHeight = 1.5; // rem
    const marginHeight = 0.25; // rem
    const paddingHeight = 0.5; // rem
    
    const totalHeight = (maxEvents * (eventHeight + marginHeight)) + paddingHeight;
    return `${totalHeight}rem`;
  }

  // Event-related computed properties
  eventsForCurrentDate = computed(() => {
    const events = this.events();
    const current = this.currentDate();
    return this.calendarUtils.getEventsForDate(events, current);
  });

  eventsForWeek = computed(() => {
    const events = this.events();
    const current = this.currentDate();
    const weekStart = current.startOf('week');
    return this.calendarUtils.getEventsForWeek(events, weekStart);
  });

  eventsForMonth = computed(() => {
    const events = this.events();
    const current = this.currentDate();
    const monthStart = current.startOf('month');
    return this.calendarUtils.getEventsForMonth(events, monthStart);
  });

  // Get events for a specific day
  getEventsForDay(date: DateTime): CalendarEvent[] {
    const events = this.events();
    return this.calendarUtils.getEventsForDate(events, date);
  }

  // Get all-day events for a specific day
  getAllDayEvents(date: DateTime): CalendarEvent[] {
    const events = this.getEventsForDay(date);
    return events.filter(event => !event.time); // All-day events don't have a time
  }

  // Get timed events for a specific day (events with time)
  getTimedEvents(date: DateTime): CalendarEvent[] {
    const events = this.getEventsForDay(date);
    return events.filter(event => event.time); // Timed events have a time
  }

  // Get project color for an event
  getEventProjectColor(event: CalendarEvent): string {
    const projects = this.projects();
    const project = projects.find(p => p.title === event.project);
    return (project?.color || '#64748b') + EVENT_CARD_OPACITY_HEX; // default gray color
  }

  // Get events for a specific time slot (only show timed events that START in this slot)
  getEventsForTimeSlot(time: DateTime, date?: DateTime): CalendarEvent[] {
    const targetDate = date || this.currentDate();
    const events = this.getTimedEvents(targetDate); // Only get timed events
    const slotDuration = this.config().timeSlotDuration || 30;
    
    return events.filter(event => {
      const eventTime = event.time!; // We know it has time since we filtered for timed events
      const eventStartMinutes = eventTime.hour * 60 + eventTime.minute;
      const slotStartMinutes = time.hour * 60 + time.minute;
      const slotEndMinutes = slotStartMinutes + slotDuration;
      
      // Only show events that START within this time slot
      return eventStartMinutes >= slotStartMinutes && eventStartMinutes < slotEndMinutes;
    });
  }

  // Handle event stacking and "view more" functionality
  getVisibleEvents(events: CalendarEvent[], maxVisible = 3): { visible: CalendarEvent[], hidden: number } {
    if (events.length <= maxVisible) {
      return { visible: events, hidden: 0 };
    }
    return { visible: events.slice(0, maxVisible), hidden: events.length - maxVisible };
  }

  // Determine if description should be shown based on event duration
  shouldShowDescription(event: CalendarEvent, slotDuration = 30): boolean {
    const duration = event.duration || 60; // default 1 hour
    const minDurationForDescription = slotDuration * 2; // Show description if event is at least 2 slots long
    return duration >= minDurationForDescription;
  }

  // Get minimum height needed for description
  getMinHeightForDescription(slotDuration = 30): number {
    return (slotDuration * 2 / slotDuration) * 2; // 2 slots worth of height in rem
  }

  // Popover management
  showPopover(event: CalendarEvent, mouseEvent?: MouseEvent | KeyboardEvent): void {
    this.popoverEvent.set(event);
    if (mouseEvent) {
      this.popoverPosition.set({ x: (mouseEvent as MouseEvent).clientX, y: (mouseEvent as MouseEvent).clientY });
    }
  }

  hidePopover(): void {
    this.popoverEvent.set(null);
    this.popoverPosition.set(null);
  }

  // Check if popover should be shown
  get shouldShowPopover(): boolean {
    return this.popoverEvent() !== null;
  }

  // Get popover event
  get popoverEventData(): CalendarEvent | null {
    return this.popoverEvent();
  }

  // Get popover position
  get popoverPositionData(): { x: number, y: number } | null {
    return this.popoverPosition();
  }

  // Check if hovering over a specific time slot
  isHoveringTimeSlot(time: DateTime, date: DateTime): boolean {
    const hoveredSlot = this.dragDropService.getHoveredTimeSlot();
    return hoveredSlot !== null && 
           hoveredSlot.time.toISODate() === time.toISODate() && 
           hoveredSlot.date.toISODate() === date.toISODate();
  }

  // Calculate event position for day/week views
  calculateEventPosition(event: CalendarEvent, slotDuration = 30): { top: number, height: number } {
    const eventTime = event.time || event.date;
    const duration = event.duration || 60; // default 1 hour
    
    const hour = eventTime.hour;
    const minute = eventTime.minute;
    const totalMinutes = hour * 60 + minute;
    
    const top = (totalMinutes / slotDuration) * 2; // 2rem per slot
    const height = (duration / slotDuration) * 2; // 2rem per slot
    
    return { top, height };
  }

  // Calculate event position within a time slot with proper stacking
  getEventPositionInSlot(event: CalendarEvent, slotTime: DateTime): { top: number, height: number } {
    const slotDuration = this.config().timeSlotDuration || 30;
    const eventTime = event.time || event.date;
    const duration = event.duration || 60;
    
    // Calculate minutes from slot start
    const slotStartMinutes = slotTime.hour * 60 + slotTime.minute;
    const eventStartMinutes = eventTime.hour * 60 + eventTime.minute;
    const minutesFromSlotStart = eventStartMinutes - slotStartMinutes;
    
    // Convert to rem units (assuming 2rem per 30-minute slot)
    const top = (minutesFromSlotStart / slotDuration) * 2;
    const height = (duration / slotDuration) * 2;
    
    return { top, height };
  }

  // Get events with proper stacking for overlapping (improved algorithm)
  getStackedEventsForSlot(events: CalendarEvent[]): {event: CalendarEvent, left: number, width: number}[] {
    if (events.length <= 1) {
      return events.map(e => ({ 
        event: e, 
        stackIndex: 0, 
        left: 3, // Start after time labels (3rem)
        width: 100 - 3.5 // 100% minus time label space and margins
      }));
    }
    
    const sortedEvents = [...events].sort((a, b) => {
      const timeA = a.time || a.date;
      const timeB = b.time || b.date;
      return timeA.toMillis() - timeB.toMillis();
    });
    
    // Group events by overlapping time ranges
    const stacks: CalendarEvent[][] = [];
    
    for (const event of sortedEvents) {
      let placed = false;
      
      // Try to place in existing stack
      //for (let i = 0; i < stacks.length; i++) {
      for (const stack of stacks) {
        let canPlaceInStack = true;
        
        // Check if this event overlaps with any event in this stack
        for (const stackEvent of stack) {
          if (this.eventsOverlap(event, stackEvent)) {
            canPlaceInStack = false;
            break;
          }
        }
        
        if (canPlaceInStack) {
          stack.push(event);
          placed = true;
          break;
        }
      }
      
      // If couldn't place in existing stack, create new one
      if (!placed) {
        stacks.push([event]);
      }
    }
    
    const result: {event: CalendarEvent, stackIndex: number, left: number, width: number}[] = [];
    const availableWidth = 100 - 3.5; // Total width minus time label space and margins
    const stackWidth = availableWidth / stacks.length; // Available width divided by number of stacks
    
    for (let stackIndex = 0; stackIndex < stacks.length; stackIndex++) {
      for (const event of stacks[stackIndex]) {
        result.push({
          event,
          stackIndex,
          left: 3 + (stackIndex * stackWidth), // Start after time labels
          width: stackWidth
        });
      }
    }
    
    return result;
  }

  private eventsOverlap(event1: CalendarEvent, event2: CalendarEvent): boolean {
    const time1 = event1.time || event1.date;
    const time2 = event2.time || event2.date;
    const duration1 = event1.duration || 60;
    const duration2 = event2.duration || 60;
    
    const start1 = time1.toMillis();
    const end1 = start1 + (duration1 * 60 * 1000);
    const start2 = time2.toMillis();
    const end2 = start2 + (duration2 * 60 * 1000);
    
    // Events overlap if one starts before the other ends
    return start1 < end2 && start2 < end1;
  }

  // Get overlapping events for better positioning
  getOverlappingEvents(events: CalendarEvent[]): CalendarEvent[][] {
    if (events.length <= 1) return [events];
    
    const sortedEvents = [...events].sort((a, b) => {
      const timeA = a.time || a.date;
      const timeB = b.time || b.date;
      return timeA.toMillis() - timeB.toMillis();
    });
    
    const groups: CalendarEvent[][] = [];
    let currentGroup: CalendarEvent[] = [sortedEvents[0]];
    
    for (let i = 1; i < sortedEvents.length; i++) {
      const currentEvent = sortedEvents[i];
      const lastEventInGroup = currentGroup[currentGroup.length - 1];
      
      const currentStart = (currentEvent.time || currentEvent.date).toMillis();
      const lastEnd = (lastEventInGroup.time || lastEventInGroup.date).plus({ 
        minutes: lastEventInGroup.duration || 60 
      }).toMillis();
      
      if (currentStart < lastEnd) {
        // Events overlap, add to current group
        currentGroup.push(currentEvent);
      } else {
        // No overlap, start new group
        groups.push(currentGroup);
        currentGroup = [currentEvent];
      }
    }
    
    groups.push(currentGroup);
    return groups;
  }

  ngOnInit(): void {
    // Initialize with config
    const config = this.config();
    if (config.defaultViewType) {
      this.calendarState.setCurrentViewType(config.defaultViewType);
    }
    if (config.defaultViewDate) {
      this.calendarState.setCurrentDate(config.defaultViewDate);
    }

    // Assign colors to projects without colors
    const projects = this.projects();
    projects.forEach(project => {
      if (!project.color) {
        project.color = this.colorGenerator.generateColor();
      }
    });
    this.calendarState.setProjects(projects);
  }

  ngAfterViewInit(): void {
    this.setupGestureHandling();
  }

  ngOnDestroy(): void {
    this.isDestroyed.set(true);
    this.colorGenerator.reset();
  }

  // HammerJS Gesture Handling
  private setupGestureHandling(): void {
    const element = this.elementRef.nativeElement;
    const hammer = this.gestureService.buildHammer(element);

    // Handle pan gestures for drag-and-drop
    hammer.on('panstart', (event: HammerInput) => {
      const target = event.target as HTMLElement;
      const eventCard = target.closest('.event-card, .all-day-event-card');
      
      if (eventCard) {
        const eventId = eventCard.getAttribute('data-event-id');
        if (eventId) {
          const calendarEvent = this.events().find(e => e.id === eventId);
          if (calendarEvent) {
            this.dragDropService.startDrag(calendarEvent, {
              x: event.center.x,
              y: event.center.y
            }, eventCard as HTMLElement);
          }
        }
      }
    });

    hammer.on('panmove', (event: HammerInput) => {
      const state = this.dragState();
      if (state.isDragging) {
        this.dragDropService.updateDragPosition({
          x: event.center.x,
          y: event.center.y
        });
        
        // Check for drop targets
        const elementUnderPointer = document.elementFromPoint(event.center.x, event.center.y);
        if (elementUnderPointer) {
          this.checkDropTarget(elementUnderPointer);
        }
      }
    });

    hammer.on('panend', (_event: HammerInput) => {
      const state = this.dragState();
      if (state.isDragging) {
        this.handleDrop();
      }
    });

    // Handle swipe gestures for navigation
    hammer.on('swipeleft', () => {
      this.navigateNext();
    });

    hammer.on('swiperight', () => {
      this.navigatePrevious();
    });
  }

  private checkDropTarget(element: Element): void {
    // Check if element is a time slot (for timed events)
    const timeSlot = element.closest('.time-slot');
    if (timeSlot) {
      const timeSlotElement = timeSlot as HTMLElement;
      const timeValue = timeSlotElement.getAttribute('data-time');
      const dateValue = timeSlotElement.getAttribute('data-date');
      
      if (timeValue && dateValue) {
        const time = DateTime.fromISO(timeValue);
        const date = DateTime.fromISO(dateValue);
        this.dragDropService.setDropTarget({ date, time });
        this.dragDropService.setHoveredTimeSlot({ time, date });
        return;
      }
    }

    // Check if element is a day cell (for all-day events or month view)
    const dayCell = element.closest('.month-day, .all-day-events-day, .all-day-events-container');
    if (dayCell) {
      const dayElement = dayCell as HTMLElement;
      const dateValue = dayElement.getAttribute('data-date');
      
      if (dateValue) {
        const date = DateTime.fromISO(dateValue);
        this.dragDropService.setDropTarget({ date });
        this.dragDropService.setHoveredTimeSlot(null); // Clear hovered time slot for all-day events
        return;
      }
    }

    // Clear drop target and hovered time slot if not over a valid drop zone
    this.dragDropService.setDropTarget(null);
    this.dragDropService.setHoveredTimeSlot(null);
  }

  private handleDrop(): void {
    const state = this.dragState();
    if (state.isDragging && state.draggedEvent && state.dropTarget) {
      const draggedEvent = state.draggedEvent;
      const dropTarget = state.dropTarget;
      
      // Determine the new time based on the drop target and current view
      let newTime: DateTime | undefined;
      
      if (dropTarget.time) {
        // Dropped on a time slot - use the slot's time
        newTime = dropTarget.time;
      } else if (draggedEvent.time && this.currentViewType() === CalendarViewType.MONTH) {
        // Dropped on a day in month view - preserve original time
        newTime = draggedEvent.time;
      } else if (!draggedEvent.time) {
        // All-day event - no time needed
        newTime = undefined;
      }
      
      this.moveEvent.emit({
        event: draggedEvent,
        newDate: dropTarget.date,
        newTime
      });
    }
    this.dragDropService.endDrag();
  }

  // Navigation methods
  navigatePrevious(): void {
    this.calendarState.navigateToPrevious();
  }

  navigateNext(): void {
    this.calendarState.navigateToNext();
  }

  navigateToday(): void {
    this.calendarState.navigateToToday();
  }

  setViewType(viewType: CalendarViewType): void {
    this.calendarState.setCurrentViewType(viewType);
  }

  onMonthSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedDate = DateTime.fromISO(target.value);
    this.calendarState.setCurrentDate(selectedDate);
  }

  // Drag and drop handlers
  onEventDragStart(event: CalendarEvent, mouseEvent: MouseEvent): void {
    this.dragDropService.startDrag(event, { 
      x: mouseEvent.clientX, 
      y: mouseEvent.clientY 
    }, mouseEvent.target as HTMLElement);
  }

  onEventDragMove(mouseEvent: MouseEvent): void {
    const state = this.dragState();
    if (state.isDragging) {
      this.dragDropService.updateDragPosition({ 
        x: mouseEvent.clientX, 
        y: mouseEvent.clientY 
      });
    }
  }

  onEventDragEnd(): void {
    const state = this.dragState();
    if (state.isDragging && state.draggedEvent && state.dropTarget) {
      this.moveEvent.emit({
        event: state.draggedEvent,
        newDate: state.dropTarget.date,
        newTime: state.dropTarget.time
      });
    }
    this.dragDropService.endDrag();
  }

  onTimeSlotDragOver(time: DateTime, date?: DateTime, event?: DragEvent): void {
    event?.preventDefault();
    const targetDate = date || this.currentDate();
    this.dragDropService.setDropTarget({ date: targetDate, time });
  }

  onTimeSlotDragLeave(): void {
    this.dragDropService.setDropTarget(null);
  }

  onDayDragOver(date: DateTime, event?: DragEvent): void {
    event?.preventDefault();
    this.dragDropService.setDropTarget({ date });
  }

  onDayDragLeave(): void {
    this.dragDropService.setDropTarget(null);
  }

  // Event handlers
  onTimeSlotClick(time: DateTime, date?: DateTime): void {
    const targetDate = date || this.currentDate();
    this.newEvent.emit({ date: targetDate, time });
  }

  onDayClick(date: DateTime): void {
    this.newEvent.emit({ date });
  }

  onEventClick(event: CalendarEvent): void {
    this.clickEvent.emit(event);
  }

  onEventMove(event: CalendarEvent, newDate: DateTime, newTime?: DateTime): void {
    this.moveEvent.emit({ event, newDate, newTime });
  }

  // Utility methods
  formatDateForDisplay(date: DateTime, viewType: CalendarViewType): string {
    return this.calendarUtils.formatDateForDisplay(date, viewType);
  }

  isToday(date: DateTime): boolean {
    return this.calendarUtils.isToday(date);
  }

  isCurrentMonth(date: DateTime, currentMonth: DateTime): boolean {
    return this.calendarUtils.isCurrentMonth(date, currentMonth);
  }

  getViewTypeButtonClass(viewType: CalendarViewType): string {
    const isActive = this.currentViewType() === viewType;
    return `view-type-button ${isActive ? 'active' : 'inactive'}`;
  }
}
