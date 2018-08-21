import { Component, OnInit } from '@angular/core';
import { ParameterHandler } from '../parameter-control';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.css']
})
export class DebugComponent implements OnInit {
  paneClasses: any;
  readModeSubscribers: any[] = [];

  reticleHandler: ParameterHandler<boolean>;
  mouseModeHandler: ParameterHandler<boolean>;
  readingDetectionHandler: ParameterHandler<boolean>;
  readWordsHandler: boolean;

  constructor() {
    this.reticleHandler = ParameterHandler.buildDefault(false);
    this.mouseModeHandler = ParameterHandler.buildDefault(false);
    this.readingDetectionHandler = ParameterHandler.buildDefault(false);

    this.readWordsHandler = false;
  }

  ngOnInit() {
    this.paneClasses = {
      'debug-pane': true,
      'closed-pane': true
    }
  }

  subscribe(cb) {
    this.readModeSubscribers.push(cb);
  }

  clearSubscribers() {
    this.readModeSubscribers = []
  }

  readModeChanged() {
    this.readWordsHandler = !this.readWordsHandler;
    this.readModeSubscribers.forEach((sub) => sub(this.readWordsHandler));
  }
}
