import { Injectable } from '@angular/core';
import { ParameterHandler } from '../components/parameter-control';
import { HostService } from './host.service';
import { AuthHttpService } from './auth-http.service';
import { Http } from '@angular/http';

@Injectable()
export class AuthService {
  static userHandler: ParameterHandler<any>;
  private static callbacks: any[] = [];

  static Init() {
    this.userHandler = ParameterHandler.buildDefault(null);
  }

  constructor(private http: Http, private authHttp: AuthHttpService) {}

  local(username, password, cb) {
    return this.http.post(HostService.url('/api/users/auth/local'), {
      username: username,
      password: password
    }).map((res: any) => {
        return res.json();
      })
      .toPromise().then((result) => {
        localStorage.setItem('token', result.token);
        AuthService.userHandler.value = result.user;

        AuthService.callbacks.forEach((waitingCb) => waitingCb(null, AuthService.userHandler));
        AuthService.callbacks = [];

        cb(null, AuthService.userHandler);
      }).catch((err) => {
        cb(err);
      });
  }

  info(cb) {
    if (AuthService.userHandler.value) {
      return cb(null, AuthService.userHandler);
    }

    this.authHttp.get(HostService.url('/api/users/current'))
      .map(res => res.json().user)
      .toPromise()
      .then(user => {
        AuthService.userHandler.value = user;
        cb(null, AuthService.userHandler);
      })
      .catch(err => {
        console.error(err);
        console.log('Not authenticated, waiting for auth');
        AuthService.callbacks.push(cb);
      })
  }

  invalidate() {
    AuthService.userHandler.value = null;
  }

  logout(cb) {
    return this.authHttp.post(HostService.url('/api/users/auth/logout'))
      .toPromise()
      .then(res => {
        localStorage.removeItem('token');

        if (res.status === 200) {
          AuthService.userHandler.value = null;
        } else {
          console.log('Disconnection failed');
        }

        cb(null);
      })
      .catch(err => {
        AuthService.userHandler.value = null;
        cb(err);
      });
  }

  getToken() {
    return localStorage.getItem('token');
  }
}
