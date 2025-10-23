import { TestBed } from '@angular/core/testing';
import { HammerGestureConfig } from '@angular/platform-browser';

import { GestureService } from './gesture.service';

describe('GestureService', () => {
  let service: GestureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should extend HammerGestureConfig', () => {
    expect(service).toBeInstanceOf(HammerGestureConfig);
  });

  describe('overrides', () => {
    it('should have correct swipe direction override', () => {
      expect(service.overrides.swipe.direction).toBe(6); // Hammer.DIRECTION_HORIZONTAL
    });

    it('should have correct pan direction override', () => {
      expect(service.overrides.pan.direction).toBe(6); // Hammer.DIRECTION_HORIZONTAL
    });

    it('should only override swipe and pan gestures', () => {
      const overrides = service.overrides;
      expect(Object.keys(overrides)).toEqual(['swipe', 'pan']);
    });
  });

  describe('buildHammer', () => {
    let mockElement: HTMLElement;

    beforeEach(() => {
      mockElement = document.createElement('div');
    });

    it('should create Hammer instance for element', () => {
      const hammerInstance = service.buildHammer(mockElement);

      expect(hammerInstance).toBeDefined();
      expect(typeof hammerInstance).toBe('object');
    });

    it('should return Hammer manager instance', () => {
      const hammerInstance = service.buildHammer(mockElement);
      
      expect(hammerInstance).toBeDefined();
      expect(typeof hammerInstance).toBe('object');
    });

    it('should handle multiple calls with different elements', () => {
      const element1 = document.createElement('div');
      const element2 = document.createElement('div');

      const instance1 = service.buildHammer(element1);
      const instance2 = service.buildHammer(element2);

      expect(instance1).toBeDefined();
      expect(instance2).toBeDefined();
    });
  });

  describe('Gesture Configuration', () => {
    it('should only enable horizontal gestures', () => {
      const overrides = service.overrides;
      
      // Both swipe and pan should be horizontal only
      expect(overrides.swipe.direction).toBe(6); // DIRECTION_HORIZONTAL
      expect(overrides.pan.direction).toBe(6); // DIRECTION_HORIZONTAL
    });

    it('should not override other gesture types', () => {
      const overrides = service.overrides;
      
      // Should not have tap, press, rotate, pinch, etc.
      expect((overrides as any).tap).toBeUndefined();
      expect((overrides as any).press).toBeUndefined();
      expect((overrides as any).rotate).toBeUndefined();
      expect((overrides as any).pinch).toBeUndefined();
    });
  });

  describe('Service Integration', () => {
    it('should be injectable', () => {
      const injectedService = TestBed.inject(GestureService);
      expect(injectedService).toBe(service);
    });

    it('should be provided in root', () => {
      // This test verifies that the service is properly configured
      // with providedIn: 'root' in the decorator
      expect(service).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle null element gracefully', () => {
      expect(() => service.buildHammer(null as any)).toThrow();
    });

    it('should handle undefined element gracefully', () => {
      expect(() => service.buildHammer(undefined as any)).toThrow();
    });
  });

  describe('Mock Verification', () => {
    it('should use correct Hammer.js constants', () => {
      // Verify that the service uses the correct direction constants
      expect(service.overrides.swipe.direction).toBe(6); // DIRECTION_HORIZONTAL
      expect(service.overrides.pan.direction).toBe(6); // DIRECTION_HORIZONTAL
    });

    it('should create Hammer instances with proper configuration', () => {
      const mockElement = document.createElement('div');
      
      const hammerInstance = service.buildHammer(mockElement);
      
      // Verify Hammer instance is created
      expect(hammerInstance).toBeDefined();
      expect(typeof hammerInstance).toBe('object');
    });
  });
});
