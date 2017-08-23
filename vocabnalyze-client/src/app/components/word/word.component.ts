import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import { Circle, MeasurementService } from '../../services/measurement.service';
import { VocabService } from '../../services/vocab.service';
import { ParameterHandler } from '../parameter-control';
import { GazeService } from '../../services/gaze.service';
import { AuthService } from '../../services/auth.service';
import { ParserService } from '../../services/parser.service';
import { GazeCursorComponent } from '../gaze-cursor/gaze-cursor.component';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.css']
})
export class WordComponent implements AfterViewInit {
  @Input() word: string;
  @Input() readWordsHandler: ParameterHandler<boolean>;
  @Input() saveCb;
  @Input() registerCb;

  userHandler: ParameterHandler<any>;
  read: boolean;
  saved: boolean;
  isStopWord: boolean;

  constructor(private el: ElementRef,
              private gazeService: GazeService,
              private vocabService: VocabService) {
    this.read = false;
    this.saved = false;
    this.userHandler = AuthService.userHandler;
  }

  ngAfterViewInit(): void {
    this.isStopWord = ParserService.StopWords.includes(this.word.toLowerCase());
    this.registerCb(this);

    this.gazeService.subscribe((coords) => {
      if (coords.type === 'fixation') {
        const rect = this.el.nativeElement.getBoundingClientRect();
        const circle = new Circle(coords.x, coords.y, GazeCursorComponent.GazeCursorRadius);

        if (MeasurementService.intersectRectCircle(rect, circle)) {
          this.setToReadStatus();
        }
      }
    });
  }

  save(): void {
    if (this.saved) {
      return;
    }

    this.saved = true;

    if (this.isStopWord) {
      return;
    }

    if (this.userHandler.value) {
      this.vocabService.saveWord(this.userHandler.value._id, this.word.toLowerCase())
        .then(result => (result) ?
          console.log('Word \'' + this.word + '\' saved') :
          console.error('Error while saving word \'' + this.word + '\''))
        .catch(error => console.error(error));
    } else {
      console.log('Can`t save the word \'' + this.word + '\'');
    }
  }

  private setToReadStatus(): void {
    if (this.read) {
      return;
    }

    this.read = true;
    this.saveCb(this);
  }
}
