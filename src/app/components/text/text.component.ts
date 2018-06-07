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
  private readonly length: number;

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

const changeClassBuilder = elem => {
  return (src, dst) => elem.getElements(src).forEach((element) => element.className = dst)
};

const classPairs = [
  ['text-unread-stopword', 'text-unread-stopword-inactive'],
  ['text-read-stopword', 'text-read-stopword-inactive'],
  ['text-saved-stopword', 'text-saved-stopword-inactive'],
  ['text-unread-word', 'text-unread-word-inactive'],
  ['text-read-word', 'text-read-word-inactive'],
  ['text-saved-word', 'text-saved-word-inactive']
];

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

  static computeTop(): number {
    return Math.max(0, 108 - window.pageYOffset);
  }

  constructor(private textService: TextService,
              private gazeService: GazeService,
              private vocabService: VocabService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.gazeService.start(this.debug.mouseModeHandler);
    this.gazeCursor.handler = this.debug.reticleHandler;

    this.paneOffset = TextComponent.computeTop();
    window.addEventListener('scroll', () => {
      this.paneOffset = TextComponent.computeTop();
    });

    this.paneClasses = true;

    this.routeSub = this.route.params.subscribe(params => {
      this.textId = params['id'];

      if (!this.textId) {
        this.textService.getSample((err, result) => {
          this.router
            .navigate(['/text/', result])
            .catch((err1) => console.log(err1));
        });
      } else {
        // Loading the content
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
    this.routeSub.unsubscribe();
  }

  private textCb(err, result) {
    if (err) {
      console.error(err);
    }

    this.text = ParserService.parseToHTML(result.body);
    this.title = result.title;

    const lemmaTable = {};
    result.body
      .forEach(paragraph => {
        paragraph.words
          .filter(word => word.lemma != null)
          .forEach(word => lemmaTable[word.raw] = word.lemma);
      });

    const paragraphCount = Array.from(new DOMParser().parseFromString('<div>' + this.text + '</div>', 'application/xml')
      .getElementsByTagName('p')).length;

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
        const srcIndex = (readMode) ? 1 : 0;
        const dstIndex = (readMode) ? 0 : 1;

        paragraphs.forEach((paragraph) => {
          const changeClass = changeClassBuilder(paragraph);
          classPairs.forEach(pair => changeClass(pair[srcIndex], pair[dstIndex]));
        });
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

              const toSaveWords = elementWordsRead
                .concat(elementWordsUnread)
                .map((element) => lemmaTable[element.innerHTML.trim()]);

              // ...we save all the read words
              if (AuthService.userHandler.value) {
                this.vocabService.saveWords(AuthService.userHandler.value._id, toSaveWords)
                  .then(result1 => (result1) ?
                    toSaveWords.forEach(word => console.log('Word \'' + word + '\' saved')) :
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
