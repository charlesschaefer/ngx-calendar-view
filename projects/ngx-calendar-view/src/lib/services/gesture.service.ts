import { Injectable } from '@angular/core';
import { HammerGestureConfig } from '@angular/platform-browser';
import Hammer from 'hammerjs';

@Injectable({
  providedIn: 'root'
})
export class GestureService extends HammerGestureConfig {
  override overrides = {
    swipe: { direction: Hammer.DIRECTION_HORIZONTAL },
    pan: { direction: Hammer.DIRECTION_HORIZONTAL }
  };

  override buildHammer(element: HTMLElement): HammerManager {
    const mc = new Hammer(element);
    
    // Configure swipe gestures
    mc.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL });
    mc.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL });
    
    return mc;
  }
}
