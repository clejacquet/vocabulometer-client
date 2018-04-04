import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class HostService {
  static url(path: string): string {
    return environment.serverUrl + path;
  }

  static urlGaze(path: string): string {
    return environment.gazeUrl + path;
  }

  constructor() { }
}
