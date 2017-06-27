import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class TextService {
  constructor(private http: Http) {}

  getText(): Promise<string> {
    return this.loadText(0);
  }

  getMockupText(): Promise<string> {
    return this.http.get('/assets/Sleeping Beauty.txt')
      .map((res: any) => res.text())
      .toPromise();
  }

  private loadText(id: number): Promise<string> {
    return this.http.get('/api/texts/' + id)
                    .map((res: any) => res.json().text)
                    .toPromise();
  }
}
