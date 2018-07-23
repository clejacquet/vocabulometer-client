import {Component, OnInit, ViewChild} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ParameterHandler } from '../parameter-control';
import {Router} from '@angular/router';
import {LanguageService} from '../../services/language.service';
import {SettingsComponent} from '../settings/settings.component';
import {ToggleComponent} from '../toggle/toggle.component';

class FakeWindow extends Window {
  public $;
}

const fwindow: FakeWindow = <FakeWindow> window;
const $ = fwindow.$;

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  providers: [AuthService]
})
export class IndexComponent implements OnInit {
  @ViewChild(ToggleComponent) toggle: ToggleComponent;

  userHandler = ParameterHandler.buildDefault(null);
  username: string;
  password: string;

  private modalId = 0;

  constructor(private router: Router,
              private auth: AuthService) { }

  ngOnInit(): void {
    this.initToggle();

    this.auth.info((err, user: ParameterHandler<any>) => {
      if (err) {
        return console.error(err);
      }

      this.userHandler = user;

      this.showLevelModal(user);
    });
  }

  showLevelModal(user) {
    const language = LanguageService.getCurrentLanguage();

    if ((user.value.isNewEn && language === 'english') || (user.value.isNewJp && language === 'japanese')) {
      if (!(user.value.isNewEn && user.value.isNewJp)) {
        this.modalId = 1;
      }

      this.showLevelModalPage();

      $('#myModal').modal({
        show: true,
        backdrop: 'static',
        keyboard: false
      });
    }
  }

  showLevelModalPage() {
    $(`#myModal${(1 - this.modalId) + 1}`)
      .css('display', 'none');

    $(`#myModal${this.modalId + 1}`)
      .css('display', 'block');
  }

  onEnglishSelected() {
    this.setLanguage('english');
    this.modalId++;
    this.showLevelModalPage();
  }

  onJapaneseSelected() {
    this.setLanguage('japanese');
    this.modalId++;
    this.showLevelModalPage();
  }

  setLanguage(language) {
    if (language instanceof Event) {
      return;
    }

    this.toggle.set(language === 'japanese');
    LanguageService.set(language);
    window.localStorage.setItem('language', language);

    this.modalId = 1;
    this.showLevelModal(this.userHandler);
  }

  initToggle() {
    const value = LanguageService.getCurrentLanguage() === 'japanese';

    this.toggle.set(value);
  }

  onLevel() {
    $('#myModal').modal('hide');
    this.router.navigate(['level']);
  }

  onQuiz() {
    $('#myModal').modal('hide');
    this.router.navigate(['quiz']);
  }

  onLogOut() {
    this.modalId = 0;
    this.auth.logout((err) => {
      if (err) {
        console.error(err);
      }
      $('#myModal').modal('hide');
      this.router.navigate(['/']);
    })
  }

  onLog(): void {
    this.auth.local(this.username, this.password, (err, user: ParameterHandler<any>) => {
      if (err) {
        return console.error(err);
      }

      if (user) {
        this.userHandler = user;

        this.showLevelModal(user);
      } else {
        console.log('Auth failed');
      }
    });
  }


}
