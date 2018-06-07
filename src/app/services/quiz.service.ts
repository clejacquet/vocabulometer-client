import { Injectable } from '@angular/core';

import * as _ from 'underscore';
import {HostService} from './host.service';
import {AuthHttpService} from './auth-http.service';

const ANSWERS_LETTERS = ['a', 'b', 'c', 'd'];

export class Question {
  public readonly level: number;
  public readonly answers: any;
  public readonly question: string;
  public readonly word: string;
  public readonly correct: Number;

  constructor(question: any) {
    this.question = question.sentence;
    this.word = question.word;
    this.answers = ANSWERS_LETTERS.map((letter) => question[letter]);
    this.correct = ANSWERS_LETTERS.indexOf(question.answer);
  }

  solve(answerId) {
    return answerId === this.correct;
  }
}

@Injectable()
export class QuizService {

  constructor(private authHttp: AuthHttpService) {}

  public saveResult(result, cb) {
    this.authHttp.post(HostService.url('/api/users/current/quiz_result'), { result: result })
      .map((res: any) => res.json().status)
      .toPromise()
      .then(status => cb(null, status === 'success'))
      .catch(err => cb(err));
  }

  public loadTest(cb: (err: any, quiz?: Question[]) => any) {
    this.authHttp.get(HostService.url('/api/users/current/quiz'))
      .map((res: any) => res.json())
      .toPromise()
      .then(lists => {
        const questions = _.shuffle(_.flatten(lists.map(list => _.sample(list, 3)), 1));
        cb(undefined, questions.map(item => new Question(item)))
      })
      .catch(err => cb(err));
  }
}
