import { Injectable } from '@angular/core';

@Injectable()
export class LanguageService {

  private static language = 'english';

  static Init() {
    const language = window.localStorage.getItem('language');
    if (language) {
      this.language = language;
    }
  }

  static set(language) {
    this.language = language;
    console.log(this.language);
  }

  static getCurrentLanguage(): string {
    return this.language;
  }
}
