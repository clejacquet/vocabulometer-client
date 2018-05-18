import { Injectable } from '@angular/core';
import { AuthHttpService } from './auth-http.service';
import { HostService } from './host.service';

@Injectable()
export class RecommendationService {

  constructor(private authHttp: AuthHttpService) { }

  public askRecommendations(limit, cb) {
    this.authHttp
      .get(HostService.url('/api/datasets/local/recommendation'), { recommender: 'review', limit: limit })
      .map((res: any) => res.json().texts)
      .toPromise()
      .then(texts => cb(null, texts))
      .catch(err => cb(err));
  }

  public askEasyTexts(limit, cb): void {
    this.authHttp
      .get(HostService.url('/api/datasets/local/recommendation'), { recommender: 'easy', limit: limit })
      .map(res => res.json())
      .toPromise()
      .then(res => cb(null, res.texts))
      .catch(err => cb(err));
  }

  public askHardTexts(limit, cb): void {
    this.authHttp
      .get(HostService.url('/api/datasets/local/recommendation'), { recommender: 'hard', limit: limit })
      .map(res => res.json())
      .toPromise()
      .then(res => cb(null, res.texts))
      .catch(err => cb(err));
  }
}
