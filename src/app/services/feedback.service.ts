import { Injectable } from '@angular/core';
import {AuthHttpService} from './auth-http.service';
import {HostService} from './host.service';

@Injectable()
export class FeedbackService {
  constructor(private authHttp: AuthHttpService) {}

  saveFeedback(feedback, uri, dataset, cb): void {
    this.authHttp
      .post(HostService.url('/api/users/current/feedback'), {
        feedback: feedback,
        uri: uri,
        dataset: dataset
      })
      .map(res => res.json())
      .toPromise()
      .then(res => cb(null, res))
      .catch(err => cb(err));
  }
}
