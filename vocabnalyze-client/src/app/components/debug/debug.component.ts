import {Component, OnInit} from '@angular/core';
import {ParameterHandler} from '../parameter-control';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.css']
})
export class DebugComponent implements OnInit {
  reticleHandler: ParameterHandler<boolean>;
  readWordsHandler: ParameterHandler<boolean>;

  constructor() {
    this.reticleHandler = new ParameterHandler(true);
    this.readWordsHandler = new ParameterHandler(true);
  }

  ngOnInit() {

  }
}
