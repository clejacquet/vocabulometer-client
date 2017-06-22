import {
  AfterViewInit, Component, Directive, ElementRef, OnInit
} from '@angular/core';
import { TextService } from './text.service';
import { GazeService } from './gaze.service';
import { Circle, MeasurementService } from './measurement.service';
import { VocabService } from './vocab.service';


@Directive({selector: '[appWord]'})
export class WordDirective implements AfterViewInit {
  private read: boolean;

  constructor(private el: ElementRef,
              private gazeService: GazeService,
              private vocabService: VocabService) {
    this.read = false;
  }

  ngAfterViewInit(): void {
    this.gazeService.subscribe((coords) => {
      if (coords.type === 'fixation') {
        const rect = this.el.nativeElement.getBoundingClientRect();
        const circle = new Circle(coords.x, coords.y, 32);

        if (MeasurementService.intersectRectCircle(rect, circle)) {
          this.setToReadStatus();
        }
      }
    });
  }

  private setToReadStatus(): void {
    if (this.read) {
      return;
    }

    const word: String = this.el.nativeElement.innerHTML;

    this.read = true;

    this.vocabService.saveWord(word)
      .then(result => (result) ?
        console.log('Word \'' + word + '\' saved') :
        console.error('Error while saving word \'' + word + '\''))
      .catch(error => console.error(error));

    this.el.nativeElement.classList.remove('text-unread-word');
    this.el.nativeElement.classList.add('text-read-word');
  }
}

@Directive({selector: '[appGazeCursor]'})
export class GazeCursorDirective implements AfterViewInit {
  constructor(private el: ElementRef, private gazeService: GazeService) {}

  ngAfterViewInit(): void {
    this.el.nativeElement.id = 'gaze-cursor';

    this.gazeService.subscribe((coords) => {
      if (coords.type === 'position') {
        this.el.nativeElement.style.left = (coords.x + window.pageXOffset) + 'px';
        this.el.nativeElement.style.top = (coords.y + window.pageYOffset) + 'px';
      }
    });
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [TextService]
})
export class AppComponent implements OnInit {
  text: string[];

  constructor(private textService: TextService, private gazeService: GazeService) {}

  ngOnInit(): void {
    this.textService.getText()
      .then(text => this.text = text.replace(/[,.:'"(){}\[\]\s_]+/, ' ').toLowerCase().split(' '))
      .catch(error => console.error(error));

    this.gazeService.start();
  }
}
