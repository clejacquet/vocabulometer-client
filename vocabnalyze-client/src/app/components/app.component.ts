import {
  AfterViewInit,
  Component, ElementRef, OnInit, ViewChild
} from '@angular/core';

import { trigger, state, style, transition, animate } from '@angular/animations';

import { TextService } from '../services/text.service';

import { SettingsComponent } from './settings/settings.component';
import { DebugComponent } from './debug/debug.component';
import { GazeCursorComponent } from './gaze-cursor/gaze-cursor.component';

import { ParameterHandler } from './parameter-control';
import { GazeService } from '../services/gaze.service';
import { ParserService } from '../services/parser.service';

import 'async' ;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
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
export class AppComponent implements OnInit, AfterViewInit {
  text: any;
  readWordsHandler: ParameterHandler<boolean>;
  paneClasses: any;

  @ViewChild(SettingsComponent) settings: SettingsComponent;
  @ViewChild(DebugComponent) debug: DebugComponent;
  @ViewChild(GazeCursorComponent) gazeCursor: GazeCursorComponent;

  constructor(private textService: TextService,
              private gazeService: GazeService,
              private parser: ParserService) {}

  ngOnInit(): void {
    this.gazeService.start(this.debug.mouseModeHandler);
    this.gazeCursor.handler = this.debug.reticleHandler;
    this.readWordsHandler = this.debug.readWordsHandler;

    this.paneClasses = true;
  }

  ngAfterViewInit(): void {


    // Loading the text
    this.textService.getText()
      .then((text) => {
        this.text = {
          title: text.title,
          body: text.body.map(paragraph => this.parser.parse(paragraph))
        }
      })
      .catch((error) => {
        console.log('Can\'t contact the server (' + error + '), offline mode activated');

        // Use the mockup text instead
        this.textService.getMockupText()
          .then((text2) => {
            this.text = {
              title: text2.title,
              body: text2.body.map(paragraph => this.parser.parse(paragraph))
            };

            console.log(this.text);
          })
          .catch(error2 => console.log(error2));
      });
  }
}
