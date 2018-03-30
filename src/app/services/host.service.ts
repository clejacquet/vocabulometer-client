import { Injectable } from '@angular/core';

@Injectable()
export class HostService {

  // TODO: LOAD URL FROM ENV VAR
  // public static URL = 'http://localhost:4100';
  public static URL = 'http://vocabulometer-dev.herokuapp.com';

  static url(path: string): string {
    return HostService.URL + path;
  }

  static urlGaze(path: string): string {
    return 'http://localhost:8080' + path;
  }

  constructor() { }
}
