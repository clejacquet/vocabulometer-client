import { Component, OnInit } from '@angular/core';
import { RecommendationService } from '../../services/recommendation.service';
import {LanguageService} from '../../services/language.service';

@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.css'],
  providers: [ RecommendationService ]
})
export class RecommendationComponent implements OnInit {
  MODES = {
    english: {
      local: {
        name: 'Text',
        icon: 'text-icon.png',
        external: false,
        produceLink: (uri) => ['/text', uri]
      },
      youtube: {
        name: 'Youtube',
        icon: 'yt.png',
        external: true,
        produceLink: (uri) => uri
      }
    },
    japanese: {
      local: {
        name: 'Text',
        icon: 'text-icon.png',
        external: false,
        produceLink: (uri) => ['/text', uri]
      },
      manga: {
        name: 'Manga',
        external: true,
        produceLink: (uri) => uri
      }
    }
  };

  recommendedContent: any[];
  easyContent: any[];
  hardContent: any[];

  mode: string;

  constructor(private recommendation: RecommendationService) { }

  setMode(mode: string) {
    if (this.mode !== mode) {
      this.mode = mode;

      this.refresh();
    } else {
      this.mode = mode;
    }
  }

  getModeKeys() {
    return Object.keys(this.MODES[LanguageService.getCurrentLanguage()]);
  }

  getModeObject(key) {
    return this.MODES[LanguageService.getCurrentLanguage()][key];
  }

  refresh() {
    this.recommendedContent = null;
    this.easyContent = null;
    this.hardContent = null;


    this.recommendation.askRecommendations(this.mode, 6, (err, content) => {
      if (err) {
        return console.error(err);
      }

      if (content) {
        this.recommendedContent = content;
      } else {
        console.log('No content loaded from recommendation');
      }
    });

    this.recommendation.askEasy(this.mode, 6, (err, content) => {
      if (err) {
        return console.error(err);
      }

      this.easyContent = content;
    });

    this.recommendation.askHard(this.mode, 6, (err, content) => {
      if (err) {
        return console.error(err);
      }

      this.hardContent = content;
    });
  }

  ngOnInit() {
    this.mode = this.getModeKeys()[0];

    this.refresh();
  }

  produceLink(uri) {
    return this.getModeObject(this.mode).produceLink(uri);
  }

}
