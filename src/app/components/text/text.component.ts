import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Circle, MeasurementService} from '../../services/measurement.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import {GazeCursorComponent} from '../gaze-cursor/gaze-cursor.component';
import {GazeService} from '../../services/gaze.service';
import {DebugComponent} from '../debug/debug.component';
import {SettingsComponent} from '../settings/settings.component';
import {AuthService} from '../../services/auth.service';
import {VocabService} from '../../services/vocab.service';
import {ParserService} from '../../services/parser.service';
import {TextService} from '../../services/text.service';
import {ActivatedRoute, Router} from '@angular/router';

class CustomParagraph {
  private count = 0;
  private length: number;

  constructor(private paragraph: HTMLParagraphElement) {
    this.length = this.paragraph.getElementsByTagName('span').length;
  }

  getRect(): ClientRect {
    return this.paragraph.getBoundingClientRect();
  }

  addReadWordCount(count: number) {
    this.count += count;
  }

  shouldSave(): boolean {
    return this.count >= this.length * 0.75;
  }

  getElements(elementClass): Element[] {
    return Array.from(this.paragraph.getElementsByClassName(elementClass));
  }
}

@Component({
  selector: 'app-text-test',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.css'],
  providers: [TextService],
  animations: [
    trigger('widthTransition', [
      state('closed', style({
        right: '0'
      })),
      state('open', style({
        right: '-430px',
        display: 'none'
      })),
      transition('closed <=> open', animate('200ms ease-in'))
    ])
  ]
})
export class TextComponent implements OnInit, OnDestroy {
  text: string;
  title: string;
  paneClasses: any;
  paneOffset: number;

  private routeSub: any;
  private textId: string;

  @ViewChild(SettingsComponent) settings: SettingsComponent;
  @ViewChild(DebugComponent) debug: DebugComponent;
  @ViewChild(GazeCursorComponent) gazeCursor: GazeCursorComponent;

  constructor(private textService: TextService,
              private gazeService: GazeService,
              private vocabService: VocabService,
              private parser: ParserService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.gazeService.start(this.debug.mouseModeHandler);
    this.gazeCursor.handler = this.debug.reticleHandler;

    this.paneOffset = this.computeTop();
    window.addEventListener('scroll', () => {
      this.paneOffset = this.computeTop();
    });

    this.paneClasses = true;

    this.routeSub = this.route.params.subscribe(params => {
      this.textId = params['id'];

      if (!this.textId) {
        this.textService.getSample((err, result) => {
          this.router.navigate(['/text/', result]);
        });
      } else {
        // Loading the text
        this.textService.getText(this.textId, (err, result) => {
          if (err) {
            return console.error(err);
          }

          this.textCb(err, result)
        });
      }
    });
  }

  ngOnDestroy() {
  }

  computeTop(): number {
    return Math.max(0, 108 - window.pageYOffset);
  }

  private textCb(err, result) {
    if (err) {
      console.error(err);
    }

    this.text = this.parser.parseToHTML(result.text.body);
    this.title = result.text.title;

    const paragraphCount = Array.from(new DOMParser().parseFromString('<div>' + this.text + '</div>', 'application/xml')
      .getElementsByTagName('p')).length;

    console.log(paragraphCount);

    const tryLoad = () => {
      const textNode = window.document.getElementsByClassName('text')[0];
      if (!textNode) {
        return setTimeout(tryLoad, 100);
      }

      if (Array.from(textNode.getElementsByTagName('p')).length < paragraphCount) {
        return setTimeout(tryLoad, 100);
      }

      const paragraphs: CustomParagraph[] = Array
        .from(textNode.getElementsByTagName('p'))
        .map((paragraph) => new CustomParagraph(paragraph));

      this.debug.subscribe((readMode) => {
        if (!readMode) {
          paragraphs.forEach((paragraph) => {
            paragraph.getElements('text-unread-stopword').forEach((element) => element.className = 'text-unread-stopword-inactive');
            paragraph.getElements('text-read-stopword').forEach((element) => element.className = 'text-read-stopword-inactive');
            paragraph.getElements('text-saved-stopword').forEach((element) => element.className = 'text-saved-stopword-inactive');
            paragraph.getElements('text-unread-word').forEach((element) => element.className = 'text-unread-word-inactive');
            paragraph.getElements('text-read-word').forEach((element) => element.className = 'text-read-word-inactive');
            paragraph.getElements('text-saved-word').forEach((element) => element.className = 'text-saved-word-inactive');
          });
        } else {
          paragraphs.forEach((paragraph) => {
            paragraph.getElements('text-unread-stopword-inactive').forEach((element) => element.className = 'text-unread-stopword');
            paragraph.getElements('text-read-stopword-inactive').forEach((element) => element.className = 'text-read-stopword');
            paragraph.getElements('text-saved-stopword-inactive').forEach((element) => element.className = 'text-saved-stopword');
            paragraph.getElements('text-unread-word-inactive').forEach((element) => element.className = 'text-unread-word');
            paragraph.getElements('text-read-word-inactive').forEach((element) => element.className = 'text-read-word');
            paragraph.getElements('text-saved-word-inactive').forEach((element) => element.className = 'text-saved-word');
          });
        }
      });

      this.gazeService.subscribe((coords) => {
        if (coords.type === 'fixation') {
          const circle = new Circle(coords.x, coords.y, GazeCursorComponent.GazeCursorRadius);

          const collided_paragraphs = paragraphs.filter((paragraph) => {
            const is_intersected = MeasurementService.intersectRectCircle(paragraph.getRect(), circle);
            return is_intersected && !paragraph.shouldSave();
          });

          collided_paragraphs.forEach((p) => {
            const elementStopWordsUnread = p.getElements('text-unread-stopword' + ((!this.debug.readWordsHandler) ? '-inactive' : ''));
            const elementStopWordsRead = p.getElements('text-read-stopword' + ((!this.debug.readWordsHandler) ? '-inactive' : ''));
            const elementWordsUnread = p.getElements('text-unread-word' + ((!this.debug.readWordsHandler) ? '-inactive' : ''));
            const elementWordsRead = p.getElements('text-read-word' + ((!this.debug.readWordsHandler) ? '-inactive' : ''));

            const elementStopWordsNowRead =
              elementStopWordsUnread.filter((element) => MeasurementService.intersectRectCircle(element.getBoundingClientRect(), circle));

            const elementWordsNowRead =
              elementWordsUnread.filter((element) => MeasurementService.intersectRectCircle(element.getBoundingClientRect(), circle));

            elementStopWordsNowRead.forEach((element) => {
              element.className = 'text-read-stopword' + ((!this.debug.readWordsHandler) ? '-inactive' : '');
            });

            elementWordsNowRead.forEach((element) => {
              element.className = 'text-read-word' + ((!this.debug.readWordsHandler) ? '-inactive' : '');
            });

            p.addReadWordCount(elementStopWordsNowRead.length + elementWordsNowRead.length);
            if (p.shouldSave()) {
              elementStopWordsUnread.forEach((element) => {
                element.className = 'text-saved-stopword' + ((!this.debug.readWordsHandler) ? '-inactive' : '');
              });

              elementWordsUnread.forEach((element) => {
                element.className = 'text-saved-word' + ((!this.debug.readWordsHandler) ? '-inactive' : '');
              });

              elementStopWordsRead.forEach((element) => {
                element.className = 'text-saved-stopword' + ((!this.debug.readWordsHandler) ? '-inactive' : '');
              });

              elementWordsRead.forEach((element) => {
                element.className = 'text-saved-word' + ((!this.debug.readWordsHandler) ? '-inactive' : '');
              });

              const toSaveWords = elementWordsRead.concat(elementWordsUnread).map((element) => element.innerHTML.trim().toLowerCase());

              // ...we save all the read words
              if (AuthService.userHandler.value) {
                this.vocabService.saveWords(AuthService.userHandler.value._id, toSaveWords)
                  .then(result => (result) ?
                    toSaveWords.forEach((word) => console.log('Word \'' + word + '\' saved')) :
                    console.error('Error while saving words'))
                  .catch(error => console.error(error));
              } else {
                console.log('Can`t save words');
              }
            }
          });
        }
      });
    };

    tryLoad();
  }
}
