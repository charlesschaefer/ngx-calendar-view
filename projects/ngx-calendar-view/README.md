# ngx-calendar-view

A responsive Angular calendar component library with day/week/month views, drag-and-drop events, and mobile swipe support.

## Features

- 📅 **Multiple View Types**: Day, Week, and Month views
- 📱 **Responsive Design**: Optimized for both desktop and mobile devices
- 🖱️ **Drag & Drop**: Move events between time slots
- 👆 **Touch Gestures**: Swipe navigation on mobile devices
- 🎨 **Customizable**: Configurable time slots, colors, and styling
- ⚡ **Modern Angular**: Built with Angular 20+ using signals and standalone components
- 🎯 **TypeScript**: Fully typed with comprehensive interfaces

## Installation

```bash
npm install ngx-calendar-view luxon
```

## Quick Start

### 1. Import the Component

```typescript
import { CalendarComponent } from 'ngx-calendar-view';

@Component({
  imports: [CalendarComponent],
  template: `
    <ngx-calendar
      [events]="events"
      [projects]="projects"
      [config]="config"
      (newEvent)="onNewEvent($event)"
      (clickEvent)="onClickEvent($event)"
      (moveEvent)="onMoveEvent($event)">
    </ngx-calendar>
  `
})
export class MyComponent {
  // Component implementation
}
```

### 2. Define Your Data

```typescript
import { DateTime } from 'luxon';
import { CalendarEvent, CalendarProject, CalendarConfig, CalendarViewType } from 'ngx-calendar-view';

export class MyComponent {
  events: CalendarEvent[] = [
    {
      id: '1',
      title: 'Team Meeting',
      description: 'Weekly standup',
      date: DateTime.now().startOf('day'),
      time: DateTime.now().set({ hour: 9, minute: 0 }),
      duration: 60,
      project: 'work'
    }
  ];

  projects: CalendarProject[] = [
    {
      title: 'Work',
      color: '#3b82f6'
    },
    {
      title: 'Personal',
      color: '#10b981'
    }
  ];

  config: CalendarConfig = {
    defaultDuration: 60,
    defaultViewType: CalendarViewType.WEEK,
    showViewTypeSelector: true,
    timeSlotDuration: 30,
    maxEventsPerDay: 3
  };
}
```

### 3. Handle Events

```typescript
export class MyComponent {
  onNewEvent(event: { date: DateTime; time?: DateTime }): void {
    console.log('New event requested:', event);
    // Open modal or form to create new event
  }

  onClickEvent(event: CalendarEvent): void {
    console.log('Event clicked:', event);
    // Open modal to view/edit event
  }

  onMoveEvent(moveData: { event: CalendarEvent; newDate: DateTime; newTime?: DateTime }): void {
    console.log('Event moved:', moveData);
    // Update event in your data store
  }
}
```

## API Reference

### CalendarEvent Interface

```typescript
interface CalendarEvent {
  id: string;                    // Unique identifier
  title: string;                 // Event title
  description?: string;          // Optional description
  date: DateTime;                // Event date (required)
  time?: DateTime;               // Event time (optional - if not provided, it's an all-day event)
  duration?: number;              // Duration in minutes (optional - defaults to config.defaultDuration)
  project?: string;              // Project identifier (optional)
}
```

### CalendarProject Interface

```typescript
interface CalendarProject {
  title: string;                 // Project name
  color?: string;                // Hex color code (optional - random color assigned if not provided)
}
```

### CalendarConfig Interface

```typescript
interface CalendarConfig {
  defaultDuration?: number;       // Default event duration in minutes (default: 60)
  defaultViewType?: CalendarViewType; // Initial view type (default: WEEK)
  defaultViewDate?: DateTime;    // Initial date to display (default: today)
  showViewTypeSelector?: boolean; // Show view type buttons (default: true)
  timeSlotDuration?: number;      // Time slot granularity in minutes (default: 30)
  maxEventsPerDay?: number;      // Max events shown per day in month view (default: 3)
}
```

### CalendarViewType Enum

```typescript
enum CalendarViewType {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month'
}
```

## Styling

The component uses Tailwind CSS for styling and includes CSS custom properties for theming:

```css
.calendar-container {
  --calendar-primary: #2563eb;
  --calendar-secondary: #64748b;
  --calendar-background: #ffffff;
  --calendar-surface: #f8fafc;
  --calendar-border: #e2e8f0;
  --calendar-text: #1e293b;
  --calendar-text-secondary: #64748b;
}
```

You can override these variables to customize the appearance:

```css
:root {
  --calendar-primary: #your-primary-color;
  --calendar-secondary: #your-secondary-color;
  /* ... other variables */
}
```

## Responsive Behavior

- **Desktop (≥768px)**: Shows navigation arrows, view type selector, and full calendar grid
- **Mobile (<768px)**: Shows month selector dropdown, view type selector, and supports swipe gestures

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

- Angular 20+
- Luxon 3.0+
- Tailwind CSS 3.4+

## Development

### Building the Library

```bash
npm run build
```

### Running the Demo

```bash
npm start
```

### Testing

```bash
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Changelog

### v0.0.0
- Initial release
- Day, Week, Month views
- Drag and drop support
- Mobile swipe gestures
- Responsive design
- TypeScript support
