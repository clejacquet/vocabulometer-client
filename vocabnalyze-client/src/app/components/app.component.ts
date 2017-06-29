import {
  AfterViewInit,
  Component, OnInit, ViewChild
} from '@angular/core';

import { TextService } from '../services/text.service';

import { SettingsComponent } from './settings/settings.component';
import { DebugComponent } from './debug/debug.component';
import { GazeCursorComponent } from './gaze-cursor/gaze-cursor.component';

import { ParameterHandler } from './parameter-control';
import { GazeService } from '../services/gaze.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [TextService]
})
export class AppComponent implements OnInit, AfterViewInit {
  text: any[];
  readWordsHandler: ParameterHandler<boolean>;

  @ViewChild(SettingsComponent) settings: SettingsComponent;
  @ViewChild(DebugComponent) debug: DebugComponent;
  @ViewChild(GazeCursorComponent) gazeCursor: GazeCursorComponent;

  constructor(private textService: TextService,
              private gazeService: GazeService) {}

  ngOnInit(): void {
    // Loading the text
    this.textService.getText()
      .then(text => this.text = text.replace(/[,.:'"(){}\[\]\s_]+/, ' ').toLowerCase().split(' '))
      .catch(() => {
        console.log('Can\'t contact the server, offline mode activated');

        // Use the mockup text instead
        this.textService.getMockupText()
          .then(text2 => this.text = text2.replace(/[,.:'"(){}\[\]\s_]+/, ' ').toLowerCase().split(' '))
          .catch(error2 => console.log(error2));
      });



    this.gazeService.start(this.debug.mouseModeHandler);
    this.gazeCursor.handler = this.debug.reticleHandler;
    this.readWordsHandler = this.debug.readWordsHandler;
  }

  ngAfterViewInit(): void {

  }
}
