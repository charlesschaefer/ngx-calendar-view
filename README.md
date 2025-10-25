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

# More information

See 👉 [ngx-calendar-view Readme](./projects/ngx-calendar-view/README.md) 


# Demo aplication

This demo app showcases the **ngx-calendar-view** Angular library component. 

It allows you to visualize, create, and interact with calendar events across different views (Day, Week, Month) with support for projects, color-coding, event editing, and drag-and-drop. 

The demo includes sample events and projects to help you explore the component's features, including event creation, modification, and navigation through different dates and view types. 

The UI is styled with Tailwind CSS and demonstrates how ngx-calendar-view can be integrated and customized within your own Angular applications.


## Developing

Since this repo has a demo app and the angular library for the component, in order to test the library in the demo app we need to build it first. 

To do this, you'll need to run the following commands when you clone this repo:
```bash
npm install
npx ng build ngx-calendar-view
ng serve
```

In order to rebuild the library everytime you make a change and then be able to check the change instantly in the demo app, build the library with `--watch`:
```bash
npx ng build ngx-calendar-view --watch
```

Then, in another terminal, run the `ng serve` command.