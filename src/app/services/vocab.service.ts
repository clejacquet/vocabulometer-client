import { Injectable } from '@angular/core';
import { HostService } from './host.service';
import { AuthHttpService } from './auth-http.service';

@Injectable()
export class VocabService {

  constructor(private authHttp: AuthHttpService) {}

  saveWord(userId: string, word: string): Promise<boolean> {
    return this.authHttp.post(HostService.url('/api/users/' + userId + '/word/'), {
      word: word
    })
      .map((res: any) => res.json().status === 'success')
      .toPromise();
  }
}
