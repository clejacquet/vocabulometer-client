import { Injectable } from '@angular/core';

@Injectable()
export class ParserService {
  public static parse(textDoc): string {
    return textDoc
      .map((paragraph) => {
        const words = paragraph.words.map(word => word.raw);
        const interWords = paragraph.interWords;

        return [].concat.apply([], this.zip([interWords, words.concat([''])])).join('');
      })
      .join('\r\n');
  }

  public static parseToHTML(textDoc): any {
    return textDoc
      .map((paragraph) => {
        const words = paragraph.words;
        const interWords = paragraph.interWords;

        return this.surroundWords(
          interWords,
          words,
          'text-unread-word-inactive',
          'text-unread-stopword-inactive');
      })
      .join('\r\n');
  }

  private static zip = rows => rows[0].map((_, c) => rows.map(row => row[c]));

  private static surroundWords(interWords, words, classWord, classStopWord) {
    const wordSpans = words
      .map(word => '<span class="' + ((word.lemma != null) ? classWord : classStopWord) + '">' + word.raw + '</span>');

    return '<p>' + [].concat.apply([], this.zip([interWords, wordSpans.concat([''])])).join('') + '</p>';
  }
}

