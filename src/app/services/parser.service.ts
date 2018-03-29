import { Injectable } from '@angular/core';

@Injectable()
export class ParserService {
  parse(textDoc): string {
    return textDoc;
  }

  parseToHTML(textDoc): any {
    return textDoc.map((paragraph) => {
      return this.surroundWords(
        paragraph.raw,
        paragraph.allWords,
        paragraph.nonStopWords,
        'text-unread-word-inactive',
        'text-unread-stopword-inactive');
    }).join('\r\n');
  }

  private surroundWords(text, words, nonStopWords, classWord, classStopWord) {
    const sentence_split = [];
    let w = 0, i = 0, last_i = 0;

    while (i < text.length && w < words.length) {
      let j = 0;

      while (j < words[w].length && i < text.length && text[i] === words[w][j]) {
        j++;
        i++;
      }

      if (j === words[w].length) {
        sentence_split.push(text.substr(last_i, i - j - last_i));
        sentence_split.push(words[w]);
        last_i = i;
        w++;
      } else {
        i++;
      }
    }

    sentence_split.push(text.substr(last_i, text.length - last_i));

    return '<p>' + sentence_split.reduce((acc, part) => {
        let result, is_word;
        [result, is_word] = acc;

        if (is_word) {
          if (nonStopWords.includes(part)) {
            result += '<span class="' + classWord + '">' + part + '</span>';
          } else {
            result += '<span class="' + classStopWord + '">' + part + '</span>';
          }
        } else {
          result += part;
        }

        return [result, !is_word]
      } , ['', false])[0] + '</p>';
  }
}

