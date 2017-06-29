import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './components/app.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { SliderComponent } from './components/slider/slider.component';
import { DebugComponent } from './components/debug/debug.component';
import { WordComponent } from './components/word/word.component';
import { GazeCursorComponent } from './components/gaze-cursor/gaze-cursor.component';

import { MeasurementService } from './services/measurement.service';
import { VocabService } from './services/vocab.service';
import { GazeService } from './services/gaze.service';


@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    SpinnerComponent,
    SliderComponent,
    DebugComponent,
    GazeCursorComponent,
    WordComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule
  ],
  bootstrap: [AppComponent],
  providers: [
    GazeService,
    MeasurementService,
    VocabService
  ]
})
export class AppModule { }
