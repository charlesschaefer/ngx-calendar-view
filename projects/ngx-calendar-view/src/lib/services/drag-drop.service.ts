import { Injectable, signal } from '@angular/core';
import { DateTime } from 'luxon';

import { CalendarEvent } from '../models';

export interface DragPosition {
  x: number;
  y: number;
}

export interface DropTarget {
  date: DateTime;
  time?: DateTime;
}

export interface DragState {
  isDragging: boolean;
  draggedEvent: CalendarEvent | null;
  dragPosition: DragPosition | null;
  dropTarget: DropTarget | null;
  dragElement: HTMLElement | null;
  hoveredTimeSlot: { time: DateTime; date: DateTime } | null;
}

@Injectable({
  providedIn: 'root'
})
export class DragDropService {
  private _dragState = signal<DragState>({
    isDragging: false,
    draggedEvent: null,
    dragPosition: null,
    dropTarget: null,
    dragElement: null,
    hoveredTimeSlot: null
  });

  /**
   * Get the current drag state
   */
  getDragState(): DragState {
    return this._dragState();
  }

  /**
   * Start a drag operation
   */
  startDrag(
    event: CalendarEvent, 
    position: DragPosition, 
    element: HTMLElement
  ): void {
    this._dragState.set({
      isDragging: true,
      draggedEvent: event,
      dragPosition: position,
      dropTarget: null,
      dragElement: element,
      hoveredTimeSlot: null
    });
  }

  /**
   * Update the drag position during a drag operation
   */
  updateDragPosition(position: DragPosition): void {
    const currentState = this._dragState();
    if (currentState.isDragging) {
      this._dragState.set({
        ...currentState,
        dragPosition: position
      });
    }
  }

  /**
   * Set the current drop target
   */
  setDropTarget(target: DropTarget | null): void {
    const currentState = this._dragState();
    if (currentState.isDragging) {
      this._dragState.set({
        ...currentState,
        dropTarget: target
      });
    }
  }

  /**
   * End the current drag operation
   */
  endDrag(): void {
    this._dragState.set({
      isDragging: false,
      draggedEvent: null,
      dragPosition: null,
      dropTarget: null,
      dragElement: null,
      hoveredTimeSlot: null
    });
  }

  /**
   * Check if currently dragging
   */
  isDragging(): boolean {
    return this._dragState().isDragging;
  }

  /**
   * Get the currently dragged event
   */
  getDraggedEvent(): CalendarEvent | null {
    return this._dragState().draggedEvent;
  }

  /**
   * Get the current drop target
   */
  getDropTarget(): DropTarget | null {
    return this._dragState().dropTarget;
  }

  /**
   * Get the current drag position
   */
  getDragPosition(): DragPosition | null {
    return this._dragState().dragPosition;
  }

  /**
   * Get the drag element
   */
  getDragElement(): HTMLElement | null {
    return this._dragState().dragElement;
  }

  /**
   * Set the hovered time slot during drag
   */
  setHoveredTimeSlot(timeSlot: { time: DateTime; date: DateTime } | null): void {
    const currentState = this._dragState();
    if (currentState.isDragging) {
      this._dragState.set({
        ...currentState,
        hoveredTimeSlot: timeSlot
      });
    }
  }

  /**
   * Get the currently hovered time slot
   */
  getHoveredTimeSlot(): { time: DateTime; date: DateTime } | null {
    return this._dragState().hoveredTimeSlot;
  }
}
