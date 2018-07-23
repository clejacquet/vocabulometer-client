import {Component, ElementRef, OnInit} from '@angular/core';
import {QuizService} from '../../services/quiz.service';
import {ParameterHandler} from '../parameter-control';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {LanguageService} from '../../services/language.service';

@Component({
  selector: 'app-set-level',
  templateUrl: './set-level.component.html',
  styleUrls: ['./set-level.component.css'],
  providers: [ QuizService ]
})
export class SetLevelComponent implements OnInit {
  private language: String;

  constructor(private element: ElementRef,
              private router: Router,
              private quizService: QuizService,
              private authService: AuthService) { }

  ngOnInit() {
    this.language = LanguageService.getCurrentLanguage();

    if (this.language === 'english') {
      this.element.nativeElement.querySelector('#japanese-levels').style.display = 'none';
    } else {
      this.element.nativeElement.querySelector('#english-levels').style.display = 'none';
    }
  }

  onSave() {
    if (this.language === 'english') {
      this.saveEnglishLevel(this.element.nativeElement.querySelector('#cefr-level').value);
    } else {
      this.saveJapaneseLevel(this.element.nativeElement.querySelector('#jlpt-level').value);
    }
  }

  saveEnglishLevel(levelCEFR) {
    let level;
    switch (levelCEFR) {
      case 'A1': level = 1; break;
      case 'A2': level = 1; break;
      case 'B1': level = 2; break;
      case 'B2': level = 3; break;
      case 'C1': level = 5; break;
      case 'C2': level = 10; break;
      default: level = 0;
    }

    this.save(level);
  }

  saveJapaneseLevel(levelJLPT) {
    let level;
    switch (levelJLPT) {
      case 'N5': level = 1; break;
      case 'N4': level = 2; break;
      case 'N3': level = 3; break;
      case 'N2': level = 4; break;
      case 'N1': level = 5; break;
      default: level = 0;
    }

    this.save(level);
  }

  save(level) {
    const fake_results = [];
    for (let i = 1; i <= level; i++) {
      fake_results.push({ word: `<${i}>`, value: true });
    }

    this.quizService.saveResult(fake_results, (err, success) => {
      if (err) {
        return console.error(err);
      }

      if (success) {
        console.log('Words saved!');
      }

      this.authService.invalidate();

      this.authService.info((err1, user: ParameterHandler<any>) => {
        if (err1) {
          console.error(err1);
        }

        this.router.navigate(['/']);
      });

    });
  }
}
