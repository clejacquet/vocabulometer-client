import {
  Component, OnDestroy, OnInit, ViewChild
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { TextService } from '../../services/text.service';

import { SettingsComponent } from '../settings/settings.component';
import { DebugComponent } from '../debug/debug.component';
import { GazeCursorComponent } from '../gaze-cursor/gaze-cursor.component';

import { ParameterHandler } from '../parameter-control';
import { GazeService } from '../../services/gaze.service';
import { ParserService } from '../../services/parser.service';


export class Paragraph {
  private readCount = 0;
  private words = [];

  public constructor(public sequences: any[]) {

  }

  public registerCb(word) { // registerCb stores the parameter 'word' that will be saved after that 75% of the paragraph is read
    this.words.push(word);     // it is called by every non stop-word of the paragraph
  }

  public saveCb() { // At each call of saveCB, it increments the counter of read words in the paragraph, and...
    this.readCount += 1;

    if (this.readCount >= 0.75 * this.sequences.length) { // ... if 75% of the paragraph is read...
      this.words.forEach(word => word.save()); // ...we save all the read words
    }
  }
}

export class Text {
  public title: string;
  public body: Paragraph[];

  public constructor(title: string, paragraphs: any[]) {
    this.title = title;
    this.body = paragraphs.map(paragraph => new Paragraph(paragraph))
  }
}

@Component({
  selector: 'app-text',
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
  text: Text;
  readWordsHandler: ParameterHandler<boolean>;
  paneClasses: any;

  private routeSub: any;
  private textId: string;

  @ViewChild(SettingsComponent) settings: SettingsComponent;
  @ViewChild(DebugComponent) debug: DebugComponent;
  @ViewChild(GazeCursorComponent) gazeCursor: GazeCursorComponent;

  constructor(private textService: TextService,
              private gazeService: GazeService,
              private parser: ParserService,
              private route: ActivatedRoute,
              private router: Router) {}

  ngOnInit(): void {
    this.gazeService.start(this.debug.mouseModeHandler);
    this.gazeCursor.handler = this.debug.reticleHandler;
    this.readWordsHandler = this.debug.readWordsHandler;

    this.routeSub = this.route.params.subscribe(params => {
      this.textId = params['id'];

      if (!this.textId) {
        this.textService.getSample((err, result) => {
          this.router.navigate(['/text/', result]);
        });
      } else {
        // Loading the text
        this.textService.getText(this.textId, (err, result) => this.textCb(err, result));
      }
    });

    this.paneClasses = true;
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  private textCb(err, text) {
    if (err) {
      console.log('Can\'t contact the server (' + err + '), offline mode activated');

      // Use the mockup text instead
      return this.textService.getMockupText((err2, text2) => {
        if (err2) {
          return console.log(err2);
        }

        this.initText(text2);
      });
    }

    this.initText(text);
  }

  private initText(text) {
    const title = text.title;
    const paragraphs = text.body.map(paragraph => this.parser.parseToHTML(paragraph));

    this.text = new Text(title, paragraphs);
  }
}
