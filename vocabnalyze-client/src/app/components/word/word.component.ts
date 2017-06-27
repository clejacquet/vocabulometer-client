import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import { Circle, MeasurementService } from '../../services/measurement.service';
import { VocabService } from '../../services/vocab.service';
import { GazeService } from '../../services/gaze.service';
import { ParameterHandler } from '../parameter-control';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.css']
})
export class WordComponent implements AfterViewInit {
  @Input() word: string;
  @Input() readWordsHandler: ParameterHandler<boolean>;

  read: boolean;

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

    this.read = true;

    this.vocabService.saveWord(this.word)
      .then(result => (result) ?
        console.log('Word \'' + this.word + '\' saved') :
        console.error('Error while saving word \'' + this.word + '\''))
      .catch(error => console.error(error));
  }
}
