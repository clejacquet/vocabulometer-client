import { Injectable } from '@angular/core';
import {HostService} from './host.service';
import {AuthHttpService} from './auth-http.service';
import {AuthService} from './auth.service';

@Injectable()
export class AdminService {

  constructor(private auth: AuthService, private authHttp: AuthHttpService) {}

  youtubeState(cb): void {
    this.authHttp
      .get(HostService.url('/api/admin/youtubeState'))
      .map(res => res.json())
      .toPromise()
      .then(res => cb(null, res.status))
      .catch(err => cb(err));
  }

  launchYoutube(authCode, cb): void {
    this.authHttp
      .post(HostService.url('/api/admin/launchYoutube'), {authCode: authCode})
      .map(res => res.json())
      .toPromise()
      .then(res => cb(null, res.result))
      .catch(err => cb(err));
  }

  youtubeAuthUrl(cb): void {
    this.authHttp
      .get(HostService.url('/api/admin/youtubeAuthUrl'))
      .map(res => res.json())
      .toPromise()
      .then(res => cb(null, res.url))
      .catch(err => cb(err));
  }

  credentials(file: File, cb) {
    const formData: any = new FormData();
    const xhr = new XMLHttpRequest();

    formData.append('credentials', file, file.name);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          cb(undefined, JSON.parse(xhr.responseText).status);
        } else {
          cb(JSON.parse(xhr.responseText));
        }
      }
    };

    xhr.open('POST', HostService.url('/api/admin/credentials'), true);
    xhr.setRequestHeader('Authorization', 'Bearer ' + this.auth.getToken());
    xhr.send(formData);
  }
}
