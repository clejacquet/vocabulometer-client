import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class TextService {
  constructor(private http: Http) {}

  addText(title, text, cb) {
    this.http.post('/api/texts', { title: title, text: text })
      .map((res: any) => res.json().result)
      .toPromise()
      .then(result => cb(null, result))
      .catch(err => cb(err));
  }

  getAllTexts(cb) {
    this.http.get('/api/texts')
      .map((res: any) => res.json().texts)
      .toPromise()
      .then(result => cb(null, result))
      .catch(err => cb(err));
  }

  getText(textId, cb): void {
    this.http.get('/api/texts/' + textId)
      .map((res: any) => res.json().text )
      .toPromise()
      .then(result => cb(null, result))
      .catch(err => cb(err));
  }

  getMockupText(cb): void {
    this.http.get('/assets/SleepingBeauty.json')
      .map((res: any) => res.json())
      .toPromise()
      .then(result => cb(null, result))
      .catch(err => cb(err));
  }

  setText(textId, text, cb) {
    this.http.put('/api/texts/' + textId + '/text', { text: text })
      .map((res: any) => res.json().status === 'success')
      .toPromise()
      .then(result => cb(null, result))
      .catch(err => cb(err));
  }

  setTitle(textId, title, cb) {
    this.http.put('/api/texts/' + textId + '/title', { title: title })
      .map((res: any) => res.json().status === 'success')
      .toPromise()
      .then(result => cb(null, result))
      .catch(err => cb(err));
  }

  deleteText(textId, cb) {
    this.http.delete('/api/texts/' + textId)
      .map((res: any) => true) // Assume that if there's no error, text is deleted TODO handle not existing texts
      .toPromise()
      .then(result => cb(null, result))
      .catch(err => cb(err));
  }
}
