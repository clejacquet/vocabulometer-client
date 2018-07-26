import {Component, ElementRef, OnInit} from '@angular/core';
import {Question, QuizService} from '../../services/quiz.service';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {ParameterHandler} from '../parameter-control';
import {LanguageService} from '../../services/language.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
  providers: [ QuizService ]
})
export class QuizComponent implements OnInit {
  currentQuestion: Question;
  currentQuestionId: number;
  quiz: Question[];
  quizResult: number;
  wrongAnswers: string[] = [];
  level: string;
  language: string;

  private givenAnswers: any[] = [];

  constructor(private router: Router,
              private authService: AuthService,
              private quizService: QuizService,
              private elem: ElementRef) { }

  ngOnInit() {
    this.language = LanguageService.getCurrentLanguage();

    this.quizService.loadTest((err, quiz) => {
      if (err) {
        return console.error(err);
      }

      this.quiz = quiz;
      this.currentQuestionId = 0;
      this.currentQuestion = this.quiz[0];
    });
  }

  saveResult() {
    this.quizService.saveResult(this.givenAnswers, (err, success) => {
      if (err) {
        return console.error(err);
      }

      this.authService.invalidate();

      this.authService.info((err1, user: ParameterHandler<any>) => {
        if (err1) {
          console.error(err1);
        }

        this.router.navigate(['/']);
      });

    })
  }

  onNext() {
    if (this.quizResult !== undefined) {
      return;
    }

    const answer: number = parseInt(this.elem.nativeElement.querySelector('input[name="answer"]:checked').value, 0);

    const result = this.currentQuestion.solve(answer);
    if (result === false) {
      this.wrongAnswers.push(this.currentQuestion.word);
    }

    this.givenAnswers.push({
      word: this.currentQuestion.word,
      value: result
    });

    if (this.currentQuestionId === this.quiz.length - 1) {
      this.quizResult = this.givenAnswers.reduce((acc, cur) => acc + (cur.value ? 1 : 0), 0);

      if (this.language === 'english') {
        const score = (this.quizResult / this.quiz.length) * 9000;
        if (score < 550) {
          this.level = 'Z';
        } else if (score < 1650) {
          this.level = 'A1';
        } else if (score < 2950) {
          this.level = 'A2';
        } else if (score < 4250) {
          this.level = 'B1';
        } else if (score < 5650) {
          this.level = 'B2';
        } else if (score < 7750) {
          this.level = 'C1';
        } else {
          this.level = 'C2';
        }
      }
    } else {
      this.currentQuestionId += 1;
      this.currentQuestion = this.quiz[this.currentQuestionId];
      this.elem.nativeElement.querySelector('#dont-know-radio').checked = true;
    }
  }
}
