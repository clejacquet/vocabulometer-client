import { Injectable } from '@angular/core';
import { texts } from './text.mockup';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class TextService {
  constructor(private http: Http) {}

  getText(): Promise<string> {
    const text_id = Math.floor(Math.random() * texts.length);
    return this.loadText(text_id);
  }

  private loadText(id: number): Promise<string> {
    return this.http.get('/api/texts/' + id)
                    .map((res: any) => res.json().text)
                    .toPromise();
  }
}
