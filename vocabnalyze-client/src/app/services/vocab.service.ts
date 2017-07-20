import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class VocabService {

  constructor(private http: Http) {}

  saveWord(userId: string, word: string): Promise<boolean> {
    return this.http.post('/api/users/' + userId + '/word/', {
      word: word
    })
      .map((res: any) => res.json().status === 'success')
      .toPromise();
  }
}
