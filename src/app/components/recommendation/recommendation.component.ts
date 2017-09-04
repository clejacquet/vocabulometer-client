import { Component, OnInit } from '@angular/core';
import { RecommendationService } from '../../services/recommendation.service';
import { StatsService } from '../../services/stats.service';

@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.css'],
  providers: [ RecommendationService, StatsService ]
})
export class RecommendationComponent implements OnInit {
  texts: any[];
  easyTexts: any[];
  hardTexts: any[];

  constructor(private recommendation: RecommendationService,
              private stats: StatsService) { }

  ngOnInit() {
    this.recommendation.askRecommendations(20, (err, texts) => {
      if (err) {
        return console.error(err);
      }

      if (texts) {
        this.texts = texts;
      } else {
        console.log('No texts loaded from recommendation');
      }
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
