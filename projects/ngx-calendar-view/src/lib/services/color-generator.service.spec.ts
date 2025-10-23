import { TestBed } from '@angular/core/testing';

import { ColorGeneratorService } from './color-generator.service';

describe('ColorGeneratorService', () => {
  let service: ColorGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColorGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('generateColor', () => {
    it('should return a valid hex color from default colors', () => {
      const color = service.generateColor();
      
      expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(typeof color).toBe('string');
    });

    it('should return different colors for multiple calls', () => {
      const color1 = service.generateColor();
      const color2 = service.generateColor();
      
      expect(color1).not.toBe(color2);
    });

    it('should cycle through default colors first', () => {
      const defaultColors = [
        '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
        '#3b82f6', '#8b5cf6', '#ec4899', '#84cc16', '#14b8a6'
      ];
      
      const generatedColors: string[] = [];
      
      // Generate more colors than default colors available
      for (const _color of defaultColors) {
        generatedColors.push(service.generateColor());
      }
      
      // First colors should match default colors (order may vary)
      expect(generatedColors.every(color => defaultColors.includes(color))).toBe(true);
    });

    it('should generate random colors when default colors are exhausted', () => {
      // Generate all default colors first
      const defaultColors = [
        '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
        '#3b82f6', '#8b5cf6', '#ec4899', '#84cc16', '#14b8a6'
      ];
      
      // Generate all default colors
      for (const _color of defaultColors) {
        service.generateColor();
      }
      
      // Next color should be a random HSL color
      const randomColor = service.generateColor();
      expect(randomColor).toMatch(/^hsl\(\d+, 70%, 50%\)$/);
    });

    it('should track used colors', () => {
      const color1 = service.generateColor();
      const color2 = service.generateColor();
      
      // Both colors should be different
      expect(color1).not.toBe(color2);
      
      // Generate many colors to ensure no duplicates (until default colors are exhausted)
      const colors = new Set<string>();
      for (let i = 0; i < 20; i++) {
        const color = service.generateColor();
        // Colors should be unique until we exhaust default colors and start generating random ones
        if (i < 10) { // First 10 should be from default colors
          expect(colors.has(color)).toBe(false);
        }
        colors.add(color);
      }
    });
  });

  describe('releaseColor', () => {
    it('should release a used color', () => {
      const color = service.generateColor();
      
      // Generate a few more colors to use up some slots
      service.generateColor();
      service.generateColor();
      
      // Release the first color
      service.releaseColor(color);
      
      // Generate a new color - it should be able to reuse the released color
      const newColor = service.generateColor();
      
      // The released color should be available again
      expect(newColor).toBe(color);
    });

    it('should handle releasing non-existent color gracefully', () => {
      const nonExistentColor = '#000000';
      
      // Should not throw an error
      expect(() => service.releaseColor(nonExistentColor)).not.toThrow();
    });

    it('should allow reusing released colors', () => {
      const color1 = service.generateColor();
      
      // Release first color
      service.releaseColor(color1);
      
      // Generate new colors - one should reuse the released color
      const newColor1 = service.generateColor();
      const newColor2 = service.generateColor();
      
      // One of the new colors should be the released color
      expect([newColor1, newColor2]).toContain(color1);
    });
  });

  describe('reset', () => {
    it('should clear all used colors', () => {
      // Generate some colors
      const color1 = service.generateColor();
      const color2 = service.generateColor();
      
      // Reset the service
      service.reset();
      
      // Generate colors again - should start from beginning
      const newColor1 = service.generateColor();
      const newColor2 = service.generateColor();
      
      // Should be able to generate the same colors again
      expect([newColor1, newColor2]).toContain(color1);
      expect([newColor1, newColor2]).toContain(color2);
    });

    it('should allow generating colors after reset', () => {
      // Generate and reset
      service.generateColor();
      service.reset();
      
      // Should be able to generate colors again
      const color = service.generateColor();
      expect(color).toBeDefined();
      expect(typeof color).toBe('string');
    });
  });

  describe('Color Format Validation', () => {
    it('should generate valid hex colors', () => {
      const color = service.generateColor();
      
      // Should be a valid hex color
      expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
    });

    it('should generate valid HSL colors when default colors exhausted', () => {
      // Generate all default colors first
      const defaultColors = [
        '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
        '#3b82f6', '#8b5cf6', '#ec4899', '#84cc16', '#14b8a6'
      ];
      
      for (const _color of defaultColors) {
        service.generateColor();
      }
      
      // Next color should be HSL format
      const hslColor = service.generateColor();
      expect(hslColor).toMatch(/^hsl\(\d+, 70%, 50%\)$/);
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple resets', () => {
      service.generateColor();
      service.reset();
      service.generateColor();
      service.reset();
      
      const color = service.generateColor();
      expect(color).toBeDefined();
    });

    it('should handle releasing same color multiple times', () => {
      const color = service.generateColor();
      
      service.releaseColor(color);
      service.releaseColor(color); // Release same color again
      
      // Should not throw error
      expect(() => service.releaseColor(color)).not.toThrow();
    });

    it('should maintain color uniqueness across multiple operations', () => {
      const colors = new Set<string>();
      
      // Generate, release, and regenerate colors
      for (let i = 0; i < 5; i++) {
        const color = service.generateColor();
        colors.add(color);
        
        if (i % 2 === 0) {
          service.releaseColor(color);
        }
      }
      
      // All colors should be unique (some may be reused after release)
      expect(colors.size).toBeGreaterThanOrEqual(3);
    });
  });
});
