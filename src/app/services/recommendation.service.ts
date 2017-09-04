import { Injectable } from '@angular/core';
import { AuthHttpService } from './auth-http.service';
import {HostService} from './host.service';

@Injectable()
export class RecommendationService {

  constructor(private authHttp: AuthHttpService,
              private host: HostService) { }

  public askRecommendations(limit, cb) {
    this.authHttp
      .get(HostService.url('/api/users/current/recommend'), { limit: limit })
      .map((res: any) => res.json().texts)
      .toPromise()
      .then(texts => cb(null, texts))
      .catch(err => cb(err));
  }
}
