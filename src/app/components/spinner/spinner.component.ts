import {AfterViewInit, Component, ElementRef, Input} from '@angular/core';
import {ParameterRangeHandler} from '../parameter-control';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements AfterViewInit {
  @Input() title: String;
  @Input() unit: String;
  @Input() valueHandler: ParameterRangeHandler;

  constructor(private el: ElementRef) { }

  ngAfterViewInit() {
    this.el.nativeElement.querySelector('.button-inc').addEventListener('click', () => {
      this.valueHandler.setValue(this.valueHandler.value + this.valueHandler.step);
    });

    this.el.nativeElement.querySelector('.button-dec').addEventListener('click', () => {
      this.valueHandler.setValue(this.valueHandler.value - this.valueHandler.step);
    });

    this.el.nativeElement.querySelector('.spinner-input').addEventListener('change', () => {
      this.valueHandler.normalize();
    })
  }

}
