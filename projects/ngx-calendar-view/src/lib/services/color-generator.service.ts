import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorGeneratorService {
  private readonly defaultColors = [
    '#ef4444', // red-500
    '#f97316', // orange-500
    '#eab308', // yellow-500
    '#22c55e', // green-500
    '#06b6d4', // cyan-500
    '#3b82f6', // blue-500
    '#8b5cf6', // violet-500
    '#ec4899', // pink-500
    '#84cc16', // lime-500
    '#14b8a6', // teal-500
  ];

  private usedColors = new Set<string>();

  generateColor(): string {
    // Find first unused color
    for (const color of this.defaultColors) {
      if (!this.usedColors.has(color)) {
        this.usedColors.add(color);
        return color;
      }
    }

    // If all colors are used, generate random color
    const randomColor = this.generateRandomColor();
    this.usedColors.add(randomColor);
    return randomColor;
  }

  private generateRandomColor(): string {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 50%)`;
  }

  releaseColor(color: string): void {
    this.usedColors.delete(color);
  }

  reset(): void {
    this.usedColors.clear();
  }
}
