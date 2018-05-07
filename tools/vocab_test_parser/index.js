const fs = require('fs');
const async = require('async');
const _ = require('underscore');

class Question {
  constructor(question) {
    this.question = question.question;
    this.answers = question.answers;
    this.correct = question.correct;
  }

  solve(answerId) {
    return answerId === this.correct;
  }
}

function loadTest(cb) {
  async.parallel([
    (cb) => {
      fs.readFile('test.txt', 'utf8', (err, data) => {
        if (err) {
          cb(err);
        }

        const sections = _.flatten(data
          .split('\r\n\r\n')
          .map((section) => {
            return section
              .split('\r\n')
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
              }));
          }), 1);

        cb(undefined, sections);
      });
    },

    (cb) => {
      fs.readFile('answers.txt', 'utf8', (err, data) => {
        if (err) {
          cb(err);
        }

        const answers = data
          .split('\r\n')
          .map((answer) => parseInt(answer));

        cb(undefined, answers);
      });
    }
  ], (err, data) => {
    if (err) {
      return cb(err);
    }

    const questions = _.zip(...data)
      .map((pair) => new Question({
        question: pair[0].question,
        answers: pair[0].answers,
        correct: pair[1]
      }));

    cb(undefined, questions);
  });
}

loadTest((err, questions) => {
  if (err) {
    return console.error(err);
  }

  console.log(questions[0].solve(1));
});

