import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class TextService {
  constructor(private http: Http) {}

  getText(): Promise<any> {
    return this.http.get('/api/texts/' + '595afc646d8f2a4ffc4b8bf8')
      .map((res: any) => res.json().text)
      .toPromise();
  }

  getMockupText(): Promise<any> {
    return this.http.get('/assets/SleepingBeauty.json')
      .map((res: any) => res.json())
      .toPromise();
  }
}
