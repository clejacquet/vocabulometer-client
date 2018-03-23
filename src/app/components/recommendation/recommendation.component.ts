import { Component, OnInit } from '@angular/core';
import { RecommendationService } from '../../services/recommendation.service';

@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.css'],
  providers: [ RecommendationService ]
})
export class RecommendationComponent implements OnInit {
  recommendedTexts: any[];
  easyTexts: any[];
  hardTexts: any[];

  constructor(private recommendation: RecommendationService) { }

  ngOnInit() {
    this.recommendation.askRecommendations(6, (err, texts) => {
      if (err) {
        return console.error(err);
      }

      if (texts) {
        this.recommendedTexts = texts;
      } else {
        console.log('No texts loaded from recommendation');
      }
    });

    this.recommendation.askEasyTexts(6, (err, texts) => {
      if (err) {
        return console.error(err);
      }

      this.easyTexts = texts;
    });

    this.recommendation.askHardTexts(6, (err, texts) => {
      if (err) {
        return console.error(err);
      }

      this.hardTexts = texts;
    });
  }

}
