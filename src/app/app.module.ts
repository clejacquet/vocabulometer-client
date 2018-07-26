import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './components/app.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { SliderComponent } from './components/slider/slider.component';
import { DebugComponent } from './components/debug/debug.component';
import { GazeCursorComponent } from './components/gaze-cursor/gaze-cursor.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { IndexComponent } from './components/index/index.component';
import { LoaderComponent } from './components/loader/loader.component';
import { RecommendationComponent } from './components/recommendation/recommendation.component';
import { TextComponent } from './components/text/text.component';
import { DatabaseComponent } from './components/database/database.component';
import { TextStructureComponent } from './components/text-structure/text-structure.component';
import { HelpComponent } from './components/help/help.component';

import { MeasurementService } from './services/measurement.service';
import { VocabService } from './services/vocab.service';
import { GazeService } from './services/gaze.service';
import { ParserService } from './services/parser.service';
import { AuthService } from './services/auth.service';
import { HostService } from './services/host.service';
import { AuthHttpService } from './services/auth-http.service';

import {enableProdMode} from '@angular/core';
import {environment} from '../environments/environment';
import { QuizComponent } from './components/quiz/quiz.component';
import { SetLevelComponent } from './components/set-level/set-level.component';
import {AdminComponent} from './components/admin/admin.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ToggleComponent } from './components/toggle/toggle.component';
import { ReviewComponent } from './components/review/review.component';
import { AboutComponent } from './components/about/about.component';
import { ProfileReadingComponent } from './components/profile-reading/profile-reading.component';
import { ProfileReviewComponent } from './components/profile-review/profile-review.component';

if (environment.production) {
  enableProdMode();
}


@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    SpinnerComponent,
    SliderComponent,
    DebugComponent,
    GazeCursorComponent,
    NotFoundComponent,
    IndexComponent,
    DatabaseComponent,
    TextStructureComponent,
    HelpComponent,
    LoaderComponent,
    RecommendationComponent,
    TextComponent,
    QuizComponent,
    SetLevelComponent,
    AdminComponent,
    ProfileComponent,
    ToggleComponent,
    ReviewComponent,
    AboutComponent,
    ProfileReadingComponent,
    ProfileReviewComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: IndexComponent },
      { path: 'about', component: AboutComponent },
      { path: 'review', component: ReviewComponent },
      { path: 'text', component: TextComponent },
      { path: 'text/:id', component: TextComponent },
      { path: 'admin', component: AdminComponent },
      { path: 'database', component: DatabaseComponent },
      { path: 'database/:id', component: DatabaseComponent },
      { path: 'database/texts/:id', component: TextStructureComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'recommendation', component: RecommendationComponent },
      { path: 'level', component: SetLevelComponent },
      { path: 'quiz', component: QuizComponent },
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
