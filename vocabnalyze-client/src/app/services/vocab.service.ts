import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class VocabService {

  constructor(private http: Http) {}

  saveWord(word: String): Promise<boolean> {
    return this.http.post('/api/users/5947ee5fdc63dabbe8bbe083/word/', {
      word: word
    })
      .map((res: any) => res.json().status === 'success')
      .toPromise();
  }
}
