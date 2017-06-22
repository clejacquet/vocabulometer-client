import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent, GazeCursorDirective, WordDirective } from './app.component';
import { HttpModule } from '@angular/http';

import { GazeService } from './gaze.service';
import { MeasurementService } from './measurement.service';
import { VocabService } from './vocab.service';

@NgModule({
  declarations: [
    AppComponent,
    GazeCursorDirective,
    WordDirective
  ],
  imports: [
    BrowserModule,
    HttpModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    GazeService,
    MeasurementService,
    VocabService
  ]
})
export class AppModule { }
