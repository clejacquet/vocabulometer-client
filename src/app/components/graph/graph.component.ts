import { Component, OnInit } from '@angular/core';
import { StatsService } from '../../services/stats.service';

declare const Plotly: any;

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css'],
  providers: [StatsService]
})
export class GraphComponent implements OnInit {
  newRecentWords: any[];
  easyTexts: any[];
  hardTexts: any[];

  constructor(private stats: StatsService) { }

  ngOnInit() {
    this.stats.wordsRead((err, days) => {
      if (err) {
        return console.error(err);
      }

      const week = this.stats.lastWeek(days);

      Plotly.plot('words-read', [{
        x: week.map(day => day.day),
        y: week.map(day => day.count),
        type: 'bar'
      }], {
        margin: { t: 1 },
        xaxis: {
          type: 'date'
        }
      }, {displayModeBar: false});
    });

    this.stats.newWordsRead((err, days) => {
      if (err) {
        return console.error(err);
      }

      const week = this.stats.lastWeek(days);

      Plotly.plot('new-words-read', [{
        x: week.map(day => day.day),
        y: week.map(day => day.count),
        type: 'bar'
      }], {
        margin: { t: 1 },
        xaxis: {
          type: 'date'
        }
      }, {displayModeBar: false});
    });

    this.stats.newRecentWordsRead((err, words) => {
      if (err) {
        return console.error(err);
      }

      this.newRecentWords = words;
    });

    this.stats.easyTexts((err, texts) => {
      if (err) {
        return console.error(err);
      }

      this.easyTexts = texts;
    });

    this.stats.hardTexts((err, texts) => {
      if (err) {
        return console.error(err);
      }

      this.hardTexts = texts;
    });
  }
}