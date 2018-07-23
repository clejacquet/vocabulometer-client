import { Injectable } from '@angular/core';
import { AuthHttpService } from './auth-http.service';
import { HostService } from './host.service';
import {LanguageService} from './language.service';

@Injectable()
export class RecommendationService {

  constructor(private authHttp: AuthHttpService) { }

  public askRecommendations(dataset, limit, cb) {
    const language = LanguageService.getCurrentLanguage();

    this.authHttp
      .get(HostService.url(`/api/datasets/${language}/${dataset}/recommendation`), { recommender: 'review', limit: limit }, false)
      .map((res: any) => res.json().texts)
      .toPromise()
      .then(texts => cb(null, texts))
      .catch(err => cb(err));
  }

  public askEasy(dataset, limit, cb): void {
    const language = LanguageService.getCurrentLanguage();

    this.authHttp
      .get(HostService.url(`/api/datasets/${language}/${dataset}/recommendation`), { recommender: 'easy', limit: limit }, false)
      .map(res => res.json())
      .toPromise()
      .then(res => cb(null, res.texts))
      .catch(err => cb(err));
  }

  public askHard(dataset, limit, cb): void {
    const language = LanguageService.getCurrentLanguage();

    this.authHttp
      .get(HostService.url(`/api/datasets/${language}/${dataset}/recommendation`), { recommender: 'hard', limit: limit }, false)
      .map(res => res.json())
      .toPromise()
      .then(res => cb(null, res.texts))
      .catch(err => cb(err));
  }
}
