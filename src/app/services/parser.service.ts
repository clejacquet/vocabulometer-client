import { Injectable } from '@angular/core';

@Injectable()
export class ParserService {
  static StopWords = [
    'a',
    'about',
    'above',
    'after',
    'again',
    'against',
    'all',
    'am',
    'an',
    'and',
    'any',
    'are',
    'aren\'t',
    'as',
    'at',
    'be',
    'because',
    'been',
    'before',
    'being',
    'below',
    'between',
    'both',
    'but',
    'by',
    'can\'t',
    'cannot',
    'could',
    'couldn\'t',
    'did',
    'didn\'t',
    'do',
    'does',
    'doesn\'t',
    'doing',
    'don\'t',
    'down',
    'during',
    'each',
    'few',
    'for',
    'from',
    'further',
    'had',
    'hadn\'t',
    'has',
    'hasn\'t',
    'have',
    'haven\'t',
    'having',
    'he',
    'he\'d',
    'he\'ll',
    'he\'s',
    'her',
    'here',
    'here\'s',
    'hers',
    'herself',
    'him',
    'himself',
    'his',
    'how',
    'how\'s',
    'i',
    'i\'d',
    'i\'ll',
    'i\'m',
    'i\'ve',
    'if',
    'in',
    'into',
    'is',
    'isn\'t',
    'it',
    'it\'s',
    'its',
    'itself',
    'let\'s',
    'me',
    'more',
    'most',
    'mustn\'t',
    'my',
    'myself',
    'no',
    'nor',
    'not',
    'of',
    'off',
    'on',
    'once',
    'only',
    'or',
    'other',
    'ought',
    'our',
    'ours	ourselves',
    'out',
    'over',
    'own',
    'same',
    'shan\'t',
    'she',
    'she\'d',
    'she\'ll',
    'she\'s',
    'should',
    'shouldn\'t',
    'so',
    'some',
    'such',
    'than',
    'that',
    'that\'s',
    'the',
    'their',
    'theirs',
    'them',
    'themselves',
    'then',
    'there',
    'there\'s',
    'these',
    'they',
    'they\'d',
    'they\'ll',
    'they\'re',
    'they\'ve',
    'this',
    'those',
    'through',
    'to',
    'too',
    'under',
    'until',
    'up',
    'very',
    'was',
    'wasn\'t',
    'we',
    'we\'d',
    'we\'ll',
    'we\'re',
    'we\'ve',
    'were',
    'weren\'t',
    'what',
    'what\'s',
    'when',
    'when\'s',
    'where',
    'where\'s',
    'which',
    'while',
    'who',
    'who\'s',
    'whom',
    'why',
    'why\'s',
    'with',
    'won\'t',
    'would',
    'wouldn\'t',
    'you',
    'you\'d',
    'you\'ll',
    'you\'re',
    'you\'ve',
    'your',
    'yours',
    'yourself',
    'yourselves'
    ];

  parseToHTML(textDoc): any {
    const text = textDoc.reduce((acc, token) => {
      switch (token.token) {
        case 'WORD':
          acc[0].push(token.value);
          acc[1].push('');
          return acc;

        case 'NUMBER': acc[1][acc[1].length - 1] += ' ' + token.value; return acc;
        case 'POINT': acc[1][acc[1].length - 1] += '.'; return acc;
        case 'COMMA': acc[1][acc[1].length - 1] += ','; return acc;
        case 'APOSTROPHE': acc[1][acc[1].length - 1] +=  '\''; return acc;
        case 'OPEN QUOTATION': acc[1][acc[1].length - 1] +=  '"'; return acc;
        case 'CLOSE QUOTATION': acc[1][acc[1].length - 1] +=  '" '; return acc;
        case 'COLON': acc[1][acc[1].length - 1] +=  ': '; return acc;
        case 'SEMI-COLON': acc[1][acc[1].length - 1] +=  ' ;'; return acc;
        case 'QUESTION': acc[1][acc[1].length - 1] +=  '?'; return acc;
        case 'EXCLAMATION': acc[1][acc[1].length - 1] += '!'; return acc;
        case 'DASH': acc[1][acc[1].length - 1] +=  ' - '; return acc;
        case 'TRIPLE POINT': acc[1][acc[1].length - 1] +=  '...'; return acc;
        case 'OPEN PARENTHESE': acc[1][acc[1].length - 1] +=  ' ('; return acc;
        case 'CLOSE PARENTHESE': acc[1][acc[1].length - 1] +=  ')'; return acc;
        case 'OPEN BRACKET': acc[1][acc[1].length - 1] +=  '['; return acc;
        case 'CLOSE BRACKET': acc[1][acc[1].length - 1] +=  '] '; return acc;
        default: return acc;
      }
    }, [[], ['']]);

    return [['', text[1][0]]]
      .concat(text[0].slice(0, text[0].length - 1).map((e, i) => [e, text[1][i + 1]]))
      .concat([[text[0][text[0].length - 1], text[1][text[1].length - 1]]]);
  }

  parse(textDoc): string {
    return textDoc.reduce((acc, token) => {
      switch (token.token) {
        case 'WORD': return acc + ' ' + token.value;
        case 'NUMBER': return acc + ' ' + token.value;
        case 'POINT': return acc + '.';
        case 'COMMA': return acc + ',';
        case 'APOSTROPHE': return acc + '\'';
        case 'OPEN QUOTATION': return acc + '"';
        case 'CLOSE QUOTATION': return acc + '" ';
        case 'COLON': return acc + ': ';
        case 'SEMI-COLON': return acc + ' ;';
        case 'QUESTION': return acc + '?';
        case 'EXCLAMATION': return acc + '!';
        case 'DASH': return acc + ' - ';
        case 'TRIPLE POINT': return acc + '...';
        case 'OPEN PARENTHESE': return acc + ' (';
        case 'CLOSE PARENTHESE': return acc + ')';
        case 'OPEN BRACKET': return acc + '[';
        case 'CLOSE BRACKET': return acc + '] ';
        default: return acc;
      }
    }, '').trim();
  }
}