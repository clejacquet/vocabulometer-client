import { Component, OnInit } from '@angular/core';
import { ParameterHandler } from '../parameter-control';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.css']
})
export class DebugComponent implements OnInit {
  reticleHandler: ParameterHandler<boolean>;
  readWordsHandler: ParameterHandler<boolean>;
  mouseModeHandler: ParameterHandler<boolean>;

  constructor() {
    this.reticleHandler = ParameterHandler.buildDefault(false);
    this.readWordsHandler = ParameterHandler.buildDefault(false);
    this.mouseModeHandler = ParameterHandler.buildDefault(false);
  }

  ngOnInit() {

  }
}
