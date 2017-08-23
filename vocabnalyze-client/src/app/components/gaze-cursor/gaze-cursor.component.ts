import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { ParameterHandler } from '../parameter-control';
import { GazeService } from '../../services/gaze.service';

@Component({
  selector: 'app-gaze-cursor',
  templateUrl: './gaze-cursor.component.html',
  styleUrls: ['./gaze-cursor.component.css']
})
export class GazeCursorComponent implements AfterViewInit {
  static readonly GazeCursorRadius = 41;

  handler: ParameterHandler<boolean>;

  private circleEl: HTMLDivElement;

  constructor(private el: ElementRef, private gazeService: GazeService) {}

  ngAfterViewInit(): void {
    this.circleEl = this.el.nativeElement.firstChild;

    this.gazeService.subscribe((coords) => {
      if (coords.type === 'position') {
        this.circleEl.style.left = (coords.x - GazeCursorComponent.GazeCursorRadius + window.pageXOffset) + 'px';
        this.circleEl.style.top = (coords.y - GazeCursorComponent.GazeCursorRadius + window.pageYOffset) + 'px';
        this.circleEl.style.borderRadius = GazeCursorComponent.GazeCursorRadius + 'px';
        this.circleEl.style.width = GazeCursorComponent.GazeCursorRadius * 2 + 'px';
        this.circleEl.style.height = GazeCursorComponent.GazeCursorRadius * 2 + 'px';
      }
    });
  }
}
