import { Injectable } from '@angular/core';
import { HostService } from './host.service';
import { AuthHttpService } from './auth-http.service';

@Injectable()
export class VocabService {

  constructor(private authHttp: AuthHttpService) {}

  saveWords(userId: string, words: string[]): Promise<boolean> {
    console.log(words);
    return this.authHttp.post(HostService.url('/api/users/' + userId + '/word/'), {
      words: words
    })
      .map((res: any) => res.json().status === 'success')
      .toPromise();
  }
}
