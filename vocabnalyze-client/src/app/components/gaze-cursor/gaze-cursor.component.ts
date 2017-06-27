import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { GazeService } from '../../services/gaze.service';
import { ParameterHandler } from '../parameter-control';

@Component({
  selector: 'app-gaze-cursor',
  templateUrl: './gaze-cursor.component.html',
  styleUrls: ['./gaze-cursor.component.css']
})
export class GazeCursorComponent implements AfterViewInit {
  handler: ParameterHandler<boolean>;

  private circleEl: HTMLDivElement;

  constructor(private el: ElementRef, private gazeService: GazeService) {}

  ngAfterViewInit(): void {
    this.circleEl = this.el.nativeElement.firstChild;


    this.gazeService.subscribe((coords) => {
      if (coords.type === 'position') {
        this.circleEl.style.left = (coords.x + window.pageXOffset) + 'px';
        this.circleEl.style.top = (coords.y + window.pageYOffset) + 'px';
      }
    });
  }
}
