import {Component, ElementRef, OnInit} from '@angular/core';
import {Question, QuizService} from '../../services/quiz.service';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {ParameterHandler} from '../parameter-control';

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
  cefrLevel: string;

  private givenAnswers: boolean[] = [];

  constructor(private router: Router,
              private authService: AuthService,
              private quizService: QuizService,
              private elem: ElementRef) { }

  ngOnInit() {
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
    this.quizService.saveResult(this.cefrLevel, (err, success) => {
      if (err) {
        return console.error(err);
      }

      if (success) {
        console.log('Words saved! You can check on Stats page');
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

    this.givenAnswers.push(result);

    if (this.currentQuestionId === this.quiz.length - 1) {
      this.quizResult = this.givenAnswers.reduce((acc, cur) => acc + (cur ? 1 : 0), 0);

      const cefrScore = (this.quizResult / this.quiz.length) * 9000;
      if (cefrScore < 550) {
        this.cefrLevel = 'Z';
      } else if (cefrScore < 1650) {
        this.cefrLevel = 'A1';
      } else if (cefrScore < 2950) {
        this.cefrLevel = 'A2';
      } else if (cefrScore < 4250) {
        this.cefrLevel = 'B1';
      } else if (cefrScore < 5650) {
        this.cefrLevel = 'B2';
      } else if (cefrScore < 7750) {
        this.cefrLevel = 'C1';
      } else {
        this.cefrLevel = 'C2';
      }
    } else {
      this.currentQuestionId += 1;
      this.currentQuestion = this.quiz[this.currentQuestionId];
      this.elem.nativeElement.querySelector('#dont-know-radio').checked = true;
    }
  }
}
