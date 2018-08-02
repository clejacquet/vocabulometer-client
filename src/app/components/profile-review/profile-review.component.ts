import { Component, OnInit } from '@angular/core';
import * as async from 'async';
import {StatsService} from '../../services/stats.service';
import {LanguageService} from '../../services/language.service';

declare const google: any;

@Component({
  selector: 'app-profile-review',
  templateUrl: './profile-review.component.html',
  styleUrls: ['./profile-review.component.css'],
  providers: [StatsService]
})
export class ProfileReviewComponent implements OnInit {
  private chart;
  private data;
  private chartDone = false;

  levels: any[];
  lastReviews: any[];
  mode;


  statusMap = {
    'Apprentice': 'apprentice',
    'Guru': 'guru',
    'Master': 'master',
    'Enlightened': 'enlightened',
    'Unknown': 'unknown'
  };

  MODES = {
    ratio: {
      title: 'Quiz & Review Ratio',
      data: () => {
        {
          if (!this.levels) {
            return undefined;
          }

          return google.visualization.arrayToDataTable([
            [
              'Level',
              'Ratio',
              { role: 'annotation' }
            ]
          ].concat(this.levels.map(level => [
            level.title,
            level.ratio,
            `${(level.ratio * 100.0).toFixed(2)}%`
          ])));
        }
      },
      options: {
        title: '% of correct answers / level',
        width: '100%',
        height: 500,
        vAxis: {
          viewWindowMode: 'explicit',
          viewWindow: {
            min: 0
          }
        }
      }
    },

    word_level: {
      title: `${LanguageService.getLanguageReference()} Progress`,
      data: () => {
        {
          if (!this.levels) {
            return undefined;
          }

          return google.visualization.arrayToDataTable([
            [
              'Level',
              'Apprentice', // { role: 'style' },
              'Guru', // { role: 'style' },
              'Master', // { role: 'style' },
              'Enlightened', // { role: 'style' }
            ]
          ].concat(this.levels.map(level => [
            level.title,
            level.score.apprentice,
            level.score.guru,
            level.score.master,
            level.score.enlightened
          ])));
        }
      },
      options: {
        isStacked: true,
        title: 'Word count / level',
        width: '100%',
        height: 500,
        vAxis: {
          viewWindowMode: 'explicit',
          viewWindow: {
            min: 0
          }
        },
        series: {
          0: { color: '#dd0093' },
          1: { color: '#882d9e' },
          2: { color: '#294ddb' },
          3: { color: '#0093dd' }
        }
      }
    },

    srs_level: {
      title: 'Vocabulary Progress',
      data: () => {
        {
          if (!this.levels) {
            return undefined;
          }

          const wordPerLevel = this.levels.reduce((acc, current) => {
            acc[0] += current.score.apprentice;
            acc[1] += current.score.guru;
            acc[2] += current.score.master;
            acc[3] += current.score.enlightened;
            return acc;
          }, [0, 0, 0, 0]);

          return google.visualization.arrayToDataTable([
            ['Level', 'Count', { role: 'style' } ],
            ['Apprentice', wordPerLevel[0], '#dd0093'],
            ['Guru', wordPerLevel[1], '#882d9e'],
            ['Master', wordPerLevel[2], '#294ddb'],
            ['Enlightened', wordPerLevel[3], '#0093dd'],
          ]);
        }
      },
      options: {
        title: 'Word count / level',
        width: '100%',
        height: 500,
        vAxis: {
          viewWindowMode: 'explicit',
          viewWindow: {
            min: 0
          }
        },
        legend: 'none'
      }
    }
  };


  constructor(private stats: StatsService) { }

  ngOnInit() {
    // Load the Visualization API and the corechart package.
    google.charts.load('current', {'packages': ['corechart']});

    let resizeTimeout;

    window.addEventListener('resize', () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }

      resizeTimeout = setTimeout(() => {
        if (this.chart) {
          this.chart.draw(this.data, this.getOptions());
        }
      }, 300);
    });

    async.parallel([
      (cb1) => google.charts.setOnLoadCallback(cb1),
      (cb1) => this.stats.score(cb1),
      (cb1) => this.stats.lastReviews(12, cb1)
    ], (err, results) => {
      if (err) {
        return console.error(err);
      }

      this.levels = results[1];
      this.lastReviews = results[2];
      this.setMode(Object.keys(this.MODES)[0]);
    });
  }

  refresh() {
    setTimeout(() => {
      if (this.chart) {
        this.chart.draw(this.data, this.getOptions());
      }
    }, 300);
  }

  draw() {
    console.log(this.data);
    this.chartDone = true;
    this.chart = new google.visualization.ColumnChart(document.getElementById('level-chart-review'));
    this.chart.draw(this.data, this.getOptions());
  }

  setMode(mode: string) {
    if (this.mode !== mode) {
      this.mode = mode;

      this.data = this.MODES[mode].data();
      this.draw();
    } else {
      this.mode = mode;
    }
  }

  getModeKeys() {
    return Object.keys(this.MODES);
  }

  getOptions() {
    return this.MODES[this.mode].options;
  }

  statusToClass(status) {
    return this.statusMap[status];
  }
}
