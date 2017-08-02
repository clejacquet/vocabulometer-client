import { Component, OnInit } from '@angular/core';
import {ParameterControl, ParameterRangeHandler} from '../parameter-control';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  controls: ParameterControl[];
  lineSpaceValue = new ParameterRangeHandler(140, 100, 300, 10);
  fontSizeValue = new ParameterRangeHandler(2.25, 0.5, 10, 0.25);

  constructor() {
    this.controls = [
      new ParameterControl('line space', '%', this.lineSpaceValue),
      new ParameterControl('font size', 'em', this.fontSizeValue)
    ]
  }

  ngOnInit() {
  }
}
