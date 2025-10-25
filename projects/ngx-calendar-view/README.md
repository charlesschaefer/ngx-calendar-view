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
npm install ngx-calendar-view luxon hammerjs
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

## Theming & Customization

The component uses Tailwind CSS for styling and includes comprehensive CSS custom properties for theming. All visual aspects can be customized by overriding CSS variables.

### CSS Custom Properties

The component exposes a comprehensive set of CSS custom properties organized into categories:

#### Base Colors
```css
.ncv-calendar-container {
  --calendar-primary: #2563eb;           /* Primary brand color */
  --calendar-secondary: #64748b;        /* Secondary text color */
  --calendar-background: #ffffff;        /* Main background */
  --calendar-surface: #f8fafc;          /* Surface/card background */
  --calendar-border: #e2e8f0;           /* Border color */
  --calendar-text: #1e293b;             /* Primary text color */
  --calendar-text-secondary: #64748b;   /* Secondary text color */
}
```

#### Additional Colors
```css
.ncv-calendar-container {
  --calendar-success: #10b981;          /* Success state color */
  --calendar-warning: #f59e0b;          /* Warning state color */
  --calendar-error: #ef4444;            /* Error state color */
  --calendar-info: #3b82f6;            /* Info state color */
}
```

#### Neutral Colors
```css
.ncv-calendar-container {
  --calendar-gray-50: #f9fafb;          /* Lightest gray */
  --calendar-gray-100: #f3f4f6;         /* Very light gray */
  --calendar-gray-200: #e5e7eb;         /* Light gray */
  --calendar-gray-300: #d1d5db;         /* Medium light gray */
  --calendar-gray-400: #9ca3af;         /* Medium gray */
  --calendar-gray-500: #6b7280;         /* Medium dark gray */
  --calendar-gray-600: #4b5563;         /* Dark gray */
  --calendar-gray-700: #374151;         /* Darker gray */
  --calendar-gray-800: #1f2937;         /* Very dark gray */
  --calendar-gray-900: #111827;         /* Darkest gray */
}
```

#### Shadows
```css
.ncv-calendar-container {
  --calendar-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --calendar-shadow-md: 0 2px 4px rgba(0, 0, 0, 0.1);
  --calendar-shadow-lg: 0 2px 8px rgba(0, 0, 0, 0.15);
  --calendar-shadow-xl: 0 4px 12px rgba(0, 0, 0, 0.15);
  --calendar-shadow-2xl: 0 8px 25px rgba(0, 0, 0, 0.25);
  --calendar-shadow-primary: 0 2px 4px rgba(37, 99, 235, 0.3);
  --calendar-shadow-primary-lg: 0 4px 12px rgba(37, 99, 235, 0.3);
  --calendar-shadow-inset: inset 0 0 0 2px rgba(59, 130, 246, 0.3);
  --calendar-shadow-inset-hover: inset 0 0 0 2px rgba(59, 130, 246, 0.5);
}
```

#### Border Radius
```css
.ncv-calendar-container {
  --calendar-radius-sm: 0.25rem;        /* Small radius */
  --calendar-radius-md: 0.375rem;       /* Medium radius */
  --calendar-radius-lg: 0.5rem;         /* Large radius */
  --calendar-radius-xl: 0.75rem;        /* Extra large radius */
}
```

#### Spacing
```css
.ncv-calendar-container {
  --calendar-spacing-xs: 0.125rem;      /* Extra small spacing */
  --calendar-spacing-sm: 0.25rem;       /* Small spacing */
  --calendar-spacing-md: 0.5rem;        /* Medium spacing */
  --calendar-spacing-lg: 0.75rem;       /* Large spacing */
  --calendar-spacing-xl: 1rem;          /* Extra large spacing */
  --calendar-spacing-2xl: 1.5rem;       /* 2x large spacing */
  --calendar-spacing-3xl: 2rem;         /* 3x large spacing */
}
```

#### Typography
```css
.ncv-calendar-container {
  /* Font Sizes */
  --calendar-font-size-xs: 0.6875rem;   /* Extra small text */
  --calendar-font-size-sm: 0.75rem;      /* Small text */
  --calendar-font-size-base: 0.875rem;   /* Base text size */
  --calendar-font-size-lg: 1rem;         /* Large text */
  --calendar-font-size-xl: 1.125rem;     /* Extra large text */
  --calendar-font-size-2xl: 1.25rem;    /* 2x large text */
  
  /* Font Weights */
  --calendar-font-weight-normal: 400;    /* Normal weight */
  --calendar-font-weight-medium: 500;    /* Medium weight */
  --calendar-font-weight-semibold: 600;  /* Semi-bold weight */
  --calendar-font-weight-bold: 700;      /* Bold weight */
  
  /* Line Heights */
  --calendar-line-height-tight: 1.2;    /* Tight line height */
  --calendar-line-height-normal: 1.3;   /* Normal line height */
  --calendar-line-height-relaxed: 1.5;   /* Relaxed line height */
}
```

#### Transitions
```css
.ncv-calendar-container {
  --calendar-transition-fast: 0.15s ease;    /* Fast transitions */
  --calendar-transition-normal: 0.2s ease;   /* Normal transitions */
  --calendar-transition-slow: 0.3s ease;    /* Slow transitions */
}
```

#### Z-Index
```css
.ncv-calendar-container {
  --calendar-z-dropdown: 10;            /* Dropdown z-index */
  --calendar-z-sticky: 20;              /* Sticky z-index */
  --calendar-z-modal: 1000;             /* Modal z-index */
  --calendar-z-popover: 9999;           /* Popover z-index */
}
```

#### Opacity
```css
.ncv-calendar-container {
  --calendar-opacity-disabled: 0.5;     /* Disabled state opacity */
  --calendar-opacity-hover: 0.9;       /* Hover state opacity */
  --calendar-opacity-drag: 0.7;        /* Drag state opacity */
}
```

### Customization Examples

#### Dark Theme
```css
.ncv-calendar-container {
  --calendar-primary: #3b82f6;
  --calendar-secondary: #9ca3af;
  --calendar-background: #1f2937;
  --calendar-surface: #374151;
  --calendar-border: #4b5563;
  --calendar-text: #f9fafb;
  --calendar-text-secondary: #d1d5db;
}
```

#### Custom Brand Colors
```css
.ncv-calendar-container {
  --calendar-primary: #7c3aed;          /* Purple primary */
  --calendar-success: #059669;          /* Green success */
  --calendar-warning: #d97706;          /* Orange warning */
  --calendar-error: #dc2626;            /* Red error */
}
```

#### Rounded Corners Theme
```css
.ncv-calendar-container {
  --calendar-radius-sm: 0.5rem;         /* More rounded small */
  --calendar-radius-md: 0.75rem;        /* More rounded medium */
  --calendar-radius-lg: 1rem;           /* More rounded large */
  --calendar-radius-xl: 1.5rem;         /* More rounded extra large */
}
```

#### Minimal Shadow Theme
```css
.ncv-calendar-container {
  --calendar-shadow-sm: 0 1px 1px rgba(0, 0, 0, 0.02);
  --calendar-shadow-md: 0 1px 2px rgba(0, 0, 0, 0.04);
  --calendar-shadow-lg: 0 1px 3px rgba(0, 0, 0, 0.06);
  --calendar-shadow-xl: 0 2px 4px rgba(0, 0, 0, 0.08);
  --calendar-shadow-2xl: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

### Global Override

To apply themes globally across your application:

```css
:root {
  --calendar-primary: #your-primary-color;
  --calendar-secondary: #your-secondary-color;
  /* ... other variables */
}
```

### Component-Specific Override

To apply themes to specific calendar instances:

```css
.my-custom-calendar {
  --calendar-primary: #custom-color;
  --calendar-radius-lg: 1rem;
  /* ... other customizations */
}
```

### Tailwind Integration

The component also integrates with Tailwind CSS classes. You can use the prefixed calendar classes:

```html
<div class="ncv-bg-calendar-primary ncv-text-calendar-background ncv-shadow-calendar-lg">
  <!-- Calendar content -->
</div>
```

Available Tailwind classes include:
- Colors: `ncv-bg-calendar-primary`, `ncv-text-calendar-text`, etc.
- Shadows: `ncv-shadow-calendar-sm`, `ncv-shadow-calendar-lg`, etc.
- Spacing: `ncv-p-calendar-md`, `ncv-m-calendar-lg`, etc.
- Typography: `ncv-text-calendar-base`, `ncv-font-calendar-medium`, etc.
- Border radius: `ncv-rounded-calendar-lg`, `ncv-rounded-calendar-xl`, etc.

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
