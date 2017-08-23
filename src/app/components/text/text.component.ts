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
  text: any;
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
    this.text = {
      title: text.title,
      body: text.body.map(paragraph => {
        const sequences = this.parser.parseToHTML(paragraph);
        const words = [];
        let readCount = 0;
        return {
          sequences: sequences,
          registerCb: (word) => {
            words.push(word);
          },
          saveCb: () => {
            readCount += 1;

            if (readCount >= 0.75 * sequences.length) {
              words.forEach(word => word.save());
            }
          }
        }
      })
    };
  }
}
