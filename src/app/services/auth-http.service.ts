import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';

@Injectable()
export class AuthHttpService {

  constructor(private http: Http) {}

  get(url, params = {}) {
    const token = localStorage.getItem('token');

    const options = new RequestOptions({
      params: new URLSearchParams(Object.keys(params).map((key) => key + '=' + params[key]).join('&'))
    });

    if (token) {
      const header: Headers = new Headers();
      header.append('Authorization', 'Bearer ' + token);
      options.headers = header;
    }

    return this.http.get(url, options);
  }

  post(url, params = {}) {
    const token = localStorage.getItem('token');

    const options = new RequestOptions();

    if (token) {
      const header: Headers = new Headers();
      header.append('Authorization', 'Bearer ' + token);
      options.headers = header;
    }

    return this.http.post(url, params, options);
  }

  put(url, params = {}) {
    // TODO De-duplicate with POST
    const token = localStorage.getItem('token');

    const options = new RequestOptions();

    if (token) {
      const header: Headers = new Headers();
      header.append('Authorization', 'Bearer ' + token);
      options.headers = header;
    }

    return this.http.put(url, params, options);
  }

  delete(url, params = {}) {
    // TODO De-duplicate with GET
    const token = localStorage.getItem('token');

    const options = new RequestOptions({
      params: new URLSearchParams(Object.keys(params).map((key) => key + '=' + params[key]).join('&'))
    });

    if (token) {
      const header: Headers = new Headers();
      header.append('Authorization', 'Bearer ' + token);
      options.headers = header;
    }

    return this.http.delete(url, options);
  }
}
