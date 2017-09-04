import { Injectable } from '@angular/core';
import { AuthHttpService } from './auth-http.service';
import { HostService } from './host.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class TextService {
  constructor(private authHttp: AuthHttpService) {}

  addText(title, text, cb) {
    this.authHttp.post(HostService.url('/api/texts'), { title: title, text: text })
      .map((res: any) => res.json().result)
      .toPromise()
      .then(result => cb(null, result))
      .catch(err => cb(err));
  }

  getTextsOnPage(page, cb) {
    this.authHttp.get(HostService.url('/api/texts'), { page: page })
      .map((res: any) => res.json())
      .toPromise()
      .then(result => cb(null, result.texts, result.lastPage))
      .catch(err => cb(err));
  }

  getText(textId, cb): void {
    this.authHttp.get(HostService.url('/api/texts/' + textId))
      .map((res: any) => res.json().text )
      .toPromise()
      .then(result => cb(null, result))
      .catch(err => cb(err));
  }

  getMockupText(cb): void {
    this.authHttp.get(HostService.url('/assets/SleepingBeauty.json'))
      .map((res: any) => res.json())
      .toPromise()
      .then(result => cb(null, result))
      .catch(err => cb(err));
  }

  getSample(cb): void {
    this.authHttp
      .get(HostService.url('/api/texts/sample'))
      .map(res => res.json())
      .toPromise()
      .then(res => cb(null, res.sample))
      .catch(err => cb(err));
  }

  setText(textId, text, cb) {
    this.authHttp.put(HostService.url('/api/texts/' + textId + '/text'), { text: text })
      .map((res: any) => res.json().status === 'success')
      .toPromise()
      .then(result => cb(null, result))
      .catch(err => cb(err));
  }

  setTitle(textId, title, cb) {
    this.authHttp.put(HostService.url('/api/texts/' + textId + '/title'), { title: title })
      .map((res: any) => res.json().status === 'success')
      .toPromise()
      .then(result => cb(null, result))
      .catch(err => cb(err));
  }

  deleteText(textId, cb) {
    this.authHttp.delete(HostService.url('/api/texts/' + textId))
      .map((res: any) => true) // Assume that if there's no error, text is deleted TODO handle not existing texts
      .toPromise()
      .then(result => cb(null, result))
      .catch(err => cb(err));
  }
}
