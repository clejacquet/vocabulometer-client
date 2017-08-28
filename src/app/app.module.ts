import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './components/app.component';
import { TextComponent } from './components/text/text.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { SliderComponent } from './components/slider/slider.component';
import { DebugComponent } from './components/debug/debug.component';
import { WordComponent } from './components/word/word.component';
import { GazeCursorComponent } from './components/gaze-cursor/gaze-cursor.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { IndexComponent } from './components/index/index.component';
import { GraphComponent } from './components/graph/graph.component';

import { MeasurementService } from './services/measurement.service';
import { VocabService } from './services/vocab.service';
import { GazeService } from './services/gaze.service';
import { ParserService } from './services/parser.service';
import { AuthService } from './services/auth.service';
import { AdminComponent } from './components/admin/admin.component';
import { TextStructureComponent } from './components/text-structure/text-structure.component';
import { HelpComponent } from './components/help/help.component';
import { HostService } from './services/host.service';
import { AuthHttpService } from './services/auth-http.service';
import { LoaderComponent } from './components/loader/loader.component';


@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    SpinnerComponent,
    SliderComponent,
    DebugComponent,
    GazeCursorComponent,
    WordComponent,
    TextComponent,
    NotFoundComponent,
    IndexComponent,
    GraphComponent,
    AdminComponent,
    TextStructureComponent,
    HelpComponent,
    LoaderComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: IndexComponent },
      { path: 'text', component: TextComponent },
      { path: 'text/:id', component: TextComponent },
      { path: 'graph', component: GraphComponent },
      { path: 'admin', component: AdminComponent },
      { path: 'admin/:id', component: AdminComponent },
      { path: 'admin/texts/:id', component: TextStructureComponent },
      { path: 'help', component: HelpComponent },
      { path: '404', component: NotFoundComponent },

      { path: '**', redirectTo: '/404' }
    ])
  ],
  bootstrap: [AppComponent],
  providers: [
    GazeService,
    MeasurementService,
    VocabService,
    ParserService,
    AuthService,
    HostService,
    AuthHttpService
  ]
})
export class AppModule { }
