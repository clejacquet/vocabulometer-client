import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.css']
})
export class ToggleComponent implements OnInit {
  @Input() titleOff: String;
  @Input() valueOff: String;
  @Input() titleOn: String;
  @Input() valueOn: String;

  @Output() change = new EventEmitter<String>();

  value: String;

  constructor(private el: ElementRef) { }

  ngOnInit() {
    this.el.nativeElement.querySelector('#togBtn').addEventListener('change', () => {
      if (!!(this.el.nativeElement.querySelector('#togBtn:checked'))) {
        this.change.emit(this.valueOn);
      } else {
        this.change.emit(this.valueOff);
      }
    })
  }

  set(value) {
    if (!value) {
      this.el.nativeElement.querySelector('#togBtn').removeAttribute('checked');
    } else {
      this.el.nativeElement.querySelector('#togBtn').setAttribute('checked', '');
    }
  }
}
