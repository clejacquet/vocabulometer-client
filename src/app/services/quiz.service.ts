import { Injectable } from '@angular/core';

import * as async from 'async';
import * as _ from 'underscore';
import {Http} from '@angular/http';

export class Question {
  public readonly answers: String[];
  public readonly question: String;
  public readonly correct: Number;

  constructor(question) {
    this.question = question.question;
    this.answers = question.answers;
    this.correct = question.correct;
  }

  solve(answerId) {
    return answerId === this.correct;
  }
}

@Injectable()
export class QuizService {

  constructor(private http: Http) {}

  public loadTest(cb) {
    async.parallel([
      (cb1) => {
        this.http.get('/assets/test.txt', {})
          .map((res: any) => res.text())
          .toPromise()
          .then(data => {
            const sections = data
              .replace(/\r/g, '')
              .split('\n\n')
              .map((section) => {
                return section
                  .split('\n')
                  .reduce((acc, cur) => {
                    if (acc[acc.length - 1].length >= 5) {
                      acc.push([]);
                    }

                    acc[acc.length - 1].push(cur);
                    return acc;
                  }, [[]])
                  .map((question) => question.map((sentence) => sentence.split(/[0-9a-d]+\. /)[1]))
                  .map((question) => ({
                    question: question[0],
                    answers: question.slice(1)
                  }))
              });
            cb1(undefined, sections);
          })
          .catch((err) => cb1(err));
      },

      (cb2) => {
        this.http.get('/assets/answers.txt', {})
          .map((res: any) => res.text())
          .toPromise()
          .then(data => {
            const sections = data
              .replace(/\r/g, '')
              .split('\n\n')
              .map((section) => {
                return section
                  .split('\n')
                  .map((answer) => parseInt(answer, 0));
              });

            cb2(undefined, sections);
          })
          .catch((err) => cb2(err));
      }
    ], (err, data) => {
      if (err) {
        return cb(err);
      }

      const questions = _.flatten(_.zip(...data)
        .map((section) => {
          return _.sample(_.zip(...section)
            .map((pair) => new Question({
              question: pair[0].question,
              answers: pair[0].answers,
              correct: pair[1]
            })), 4);
        }), 1);

      cb(undefined, questions);
    });
  }
}
