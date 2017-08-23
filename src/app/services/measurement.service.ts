import { Injectable } from '@angular/core';

export class Circle {
  constructor(public x: number, public y: number, public radius: number) {}
}

@Injectable()
export class MeasurementService {
  static intersectRectCircle(rect: ClientRect, circle: Circle): boolean {
    const dx = circle.x - Math.max(rect.left, Math.min(circle.x, rect.left + rect.width));
    const dy = circle.y - Math.max(rect.top, Math.min(circle.y, rect.top + rect.height));
    return (dx * dx + dy * dy) < (circle.radius * circle.radius);
  }
}
