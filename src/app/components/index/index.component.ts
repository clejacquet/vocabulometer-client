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

  static saveLanguage(language) {
    LanguageService.set(language);
    window.localStorage.setItem('language', language);
  }

  constructor(private router: Router,
              private auth: AuthService) { }

  ngOnInit(): void {
    this.initToggle();

    $('#myModal').modal({
      show: false,
      backdrop: 'static',
      keyboard: false
    });

    this.auth.info((err, user: ParameterHandler<any>) => {
      if (err) {
        return console.error(err);
      }

      this.userHandler = user;

      if (user.value.isNewEn && user.value.isNewJp) {
        this.modalId = 0;
      } else {
        this.modalId = 1;
      }

      this.showLevelModal(user, LanguageService.getCurrentLanguage());
    });
  }

  showLevelModal(user, language) {
    const modalElem = $('#myModal');

    if (this.modalId === 1) {
      if ((language === 'english' && !user.value.isNewEn) || (language === 'japanese' && !user.value.isNewJp)) {
        modalElem.modal('hide');
        return;
      }
    }

    this.showLevelModalPage();

    modalElem.modal('show');
  }

  showLevelModalPage() {
    $(`#myModal${(1 - this.modalId) + 1}`)
      .css('display', 'none');

    $(`#myModal${this.modalId + 1}`)
      .css('display', 'block');
  }

  onEnglishSelected() {
    this.setLanguage('english');
    this.modalId = 1;
    this.showLevelModal(this.userHandler, 'english');
  }

  onJapaneseSelected() {
    this.setLanguage('japanese');
    this.modalId = 1;
    this.showLevelModal(this.userHandler, 'japanese');
  }

  onLanguageChange(language) {
    if (language instanceof Event) {
      return;
    }

    IndexComponent.saveLanguage(language);
    this.showLevelModal(this.userHandler, language);
  }

  setLanguage(language) {
    this.toggle.set(language === 'japanese');
    IndexComponent.saveLanguage(language);
  }

  initToggle() {
    const value = LanguageService.getCurrentLanguage() === 'japanese';

    this.toggle.set(value);
  }

  onLevel() {
    $('#myModal').modal('hide');
    this.router.navigate(['level']);
  }

  onReturnToLanguageChoice() {
    this.modalId = 0;
    this.showLevelModalPage();
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

      console.log(user);

      if (user) {
        this.userHandler = user;

        if (user.value.isNewEn && user.value.isNewJp) {
          this.modalId = 0;
        } else {
          this.modalId = 1;
        }

        this.showLevelModal(user, LanguageService.getCurrentLanguage());
      } else {
        console.log('Auth failed');
      }
    });
  }


}
