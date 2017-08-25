import { Injectable } from '@angular/core';

@Injectable()
export class HostService {

  // public static URL = 'http://10.20.1.131:4100';
  public static URL = 'http://vocabulometer.herokuapp.com';

  static url(path: string): string {
    return HostService.URL + path;
  }

  static urlGaze(path: string): string {
    return 'localhost:3000' + path;
  }

  constructor() { }
}
