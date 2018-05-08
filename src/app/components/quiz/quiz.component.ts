import {Component, ElementRef, OnInit} from '@angular/core';
import {Question, QuizService} from '../../services/quiz.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
  providers: [ QuizService ]
})
export class QuizComponent implements OnInit {
  currentQuestion: Question;
  currentQuestionId: number;
  quiz;
  quizResult;
  cefrLevel;

  private givenAnswers: boolean[] = [];

  constructor(private quizService: QuizService,
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

  onNext() {
    if (this.quizResult !== undefined) {
      return;
    }

    const answer: number = parseInt(this.elem.nativeElement.querySelector('input[name="answer"]:checked').value, 0);
    this.givenAnswers.push(this.currentQuestion.solve(answer));

    if (this.currentQuestionId === this.quiz.length - 1) {
      this.quizResult = this.givenAnswers.reduce((acc, cur) => acc + (cur ? 1 : 0), 0);

      const cefrScore = (this.quizResult / this.quiz.length) * 9000;
      if (cefrScore < 1100) {
        this.cefrLevel = 'A1';
      } else if (cefrScore < 2200) {
        this.cefrLevel = 'A2';
      } else if (cefrScore < 3700) {
        this.cefrLevel = 'B1';
      } else if (cefrScore < 4800) {
        this.cefrLevel = 'B2';
      } else if (cefrScore < 6500) {
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
