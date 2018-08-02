import { Component, OnInit } from '@angular/core';
import {StatsService} from '../../services/stats.service';
import {Router} from '@angular/router';
import * as async from 'async';

declare const google: any;

@Component({
  selector: 'app-profile-reading',
  templateUrl: './profile-reading.component.html',
  styleUrls: ['./profile-reading.component.css'],
  providers: [StatsService]
})
export class ProfileReadingComponent implements OnInit {
  private chart;
  private data;
  private chartDone = false;

  wordsRead;
  newWordsRead;
  newRecentWords: any[];
  levels: any[];

  MODES = {
    known: {
      title: 'Known Words by Reading',
      data: () => {
        {
          return google.visualization.arrayToDataTable([
            ['Level', 'Known', { role: 'style' }, { role: 'annotation' } ]
          ].concat(this.levels.map(level => [
            level.title,
            level.known,
            ProfileReadingComponent.computeColorString(level.known),
            level.known
          ])));
        }
      },
      options: {
        title: 'Words learned per level',
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
    read: {
      title: 'Words Read / day',
      data: () => {
        {
          const data = google.visualization.arrayToDataTable([
            ['Days', 'Read' ]
          ].concat(this.wordsRead.map(day => [
            new Date(day._id),
            day.count
          ])));

          const formatter_short = new google.visualization.DateFormat({formatType: 'short'});
          formatter_short.format(data, 0);

          return data;
        }
      },
    },
    newRead: {
      title: 'New Words Read / day',
      data: () => {
        {
          const data = google.visualization.arrayToDataTable([
            ['Days', 'Newly Read' ]
          ].concat(this.newWordsRead.map(day => [
            new Date(day._id),
            day.count
          ])));

          const formatter_short = new google.visualization.DateFormat({formatType: 'short'});
          formatter_short.format(data, 0);

          return data;
        }
      },
    },
  };

  mode: string;

  private static getMixColor(color1, color2, blendFactor) {
    return color1.map((_, i) => Math.floor(color1[i] * blendFactor + color2[i] * (1 - blendFactor)));
  }

  private static computeColorString(ratio) {
    return 'rgb(' + ProfileReadingComponent.getMixColor([63, 127, 191], [255, 255, 255], 0.2 + Math.sqrt(ratio) * 0.8).join(', ') + ')'
  }

  draw() {
    this.chartDone = true;
    this.chart = new google.visualization.ColumnChart(document.getElementById('level-chart-reading'));
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

  constructor(private stats: StatsService, private router: Router) { }

  refresh() {
    setTimeout(() => {
      if (this.chart) {
        this.chart.draw(this.data, this.getOptions());
      }
    }, 300);
  }

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
      (cb1) => this.stats.wordsRead(7, cb1),
      (cb1) => this.stats.newWordsRead(7, cb1),
      (cb1) => this.stats.newRecentWordsRead(12, cb1)
    ], (err, results) => {
      if (err) {
        return console.error(err);
      }

      this.levels = results[1];
      this.wordsRead = results[2];
      this.newWordsRead = results[3];
      this.newRecentWords = results[4].map(word => ({
        _id: word._id,
        level: word.level,
        status: {
          value: word.status.toLowerCase(),
          title: word.status
        }
      }));

      this.setMode(Object.keys(this.MODES)[0]);
    });
  }
}
