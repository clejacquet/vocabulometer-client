import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, URLSearchParams } from '@angular/http';
import {LanguageService} from './language.service';

@Injectable()
export class AuthHttpService {

  constructor(private http: Http) {}

  get(url, params = {}, setLanguage = true) {
    const token = localStorage.getItem('token');

    const urlParams =  new URLSearchParams();
    Object.keys(params).forEach((key) => {
      urlParams.set(key, params[key]);
    });

    // Language
    if (setLanguage) {
      urlParams.set('language', LanguageService.getCurrentLanguage());
    }

    const options = new RequestOptions();
    options.params = urlParams;

    if (token) {
      const header: Headers = new Headers();
      header.append('Authorization', 'Bearer ' + token);
      options.headers = header;
    }

    return this.http.get(url, options);
  }

  post(url, params = {}, setLanguage = true) {
    const token = localStorage.getItem('token');

    // Language
    if (setLanguage) {
      params['language'] = LanguageService.getCurrentLanguage();
    }

    const options = new RequestOptions();

    if (token) {
      const header: Headers = new Headers();
      header.append('Authorization', 'Bearer ' + token);
      options.headers = header;
    }

    return this.http.post(url, params, options);
  }

  put(url, params = {}, setLanguage = true) {
    // TODO De-duplicate with POST
    const token = localStorage.getItem('token');

    // Language
    if (setLanguage) {
      params['language'] = LanguageService.getCurrentLanguage();
    }

    const options = new RequestOptions();

    if (token) {
      const header: Headers = new Headers();
      header.append('Authorization', 'Bearer ' + token);
      options.headers = header;
    }

    return this.http.put(url, params, options);
  }

  delete(url, params = {}, setLanguage = true) {
    // TODO De-duplicate with GET
    const token = localStorage.getItem('token');

    const urlParams = new URLSearchParams(Object.keys(params).map((key) => key + '=' + params[key]).join('&'));

    // Language
    if (setLanguage) {
      urlParams.set('language', LanguageService.getCurrentLanguage());
    }


    const options = new RequestOptions({
      params: urlParams
    });

    if (token) {
      const header: Headers = new Headers();
      header.append('Authorization', 'Bearer ' + token);
      options.headers = header;
    }

    return this.http.delete(url, options);
  }
}
