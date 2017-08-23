import { Injectable } from '@angular/core';

@Injectable()
export class HostService {

  public static URL = 'http://10.20.1.131';

  static url(path: string): string {
    return HostService.URL + ':4100' + path;
  }

  static urlGaze(path: string): string {
    return HostService.URL + ':3000' + path;
  }

  constructor() { }
}
