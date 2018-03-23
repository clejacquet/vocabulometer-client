import { Component, OnInit } from '@angular/core';
import {ParameterControl, ParameterRangeHandler} from '../parameter-control';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  controls: ParameterControl[];
  lineSpaceValue = new ParameterRangeHandler(150, 100, 300, 10);
  fontSizeValue = new ParameterRangeHandler(1.5, 0.5, 10, 0.25);

  constructor() {
    this.controls = [
      new ParameterControl('Line Space', '%', this.lineSpaceValue),
      new ParameterControl('Font Size', 'em', this.fontSizeValue)
    ]
  }

  ngOnInit() {
  }
}
