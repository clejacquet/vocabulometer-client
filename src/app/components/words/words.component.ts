import { Component, OnInit } from '@angular/core';
import {WordService} from '../../services/word.service';


@Component({
  selector: 'app-words',
  templateUrl: './words.component.html',
  styleUrls: ['./words.component.css'],
  providers: [WordService]
})
export class WordsComponent implements OnInit {
  private tradLearningArray: string[] = [];
  private word_id: number;
  private vocalUrl: string;

    user_id: string;
    current_word: string;
    hide = false;
    srsSize: number;
    learningArray: string[] = [];


  constructor(private wordService: WordService) {  }


  getLearningArray() {
    return this.learningArray;
  }

  getTradLearningArray() {
    return this.tradLearningArray;
  }

  hideList(): boolean {
    if (this.hide === true) {
      this.hide = false;
      return false;
    } else {
      this.hide = true;
      return true;
    }
  }

  checkHide(): boolean { // Check the status of hide to hide/show the List
    return this.hide !== true;
  }
  onNameKeyUp(event: any) {
    this.user_id = event.target.value;
  }
  onWordKeyUp(event: any) {
    this.current_word = event.target.value;
  }

  getWordsToLearn() {
    this.wordService.getWordsToLearn(this.user_id).then((data: string[]) => {
      this.learningArray = data;
      console.log(this.learningArray);
      this.wordService.translateWord(data.join('$'))
      .then(
          (result: string) => {
              console.log('RES: ' + result);
          this.tradLearningArray = result.split('$');  // shaping the trad learning array
          for (let i = 0; i < this.tradLearningArray.length; i++) {
              this.tradLearningArray[i] = this.tradLearningArray[i].trim();
          }

          console.log('tradLearningArray ' + this.tradLearningArray);
          console.log(this.learningArray);
          for (let i = 0; i < this.tradLearningArray.length; i++) {
            this.learningArray.push(this.tradLearningArray[i]);   // concatenation of the learning array and its translation
          }
          console.log(this.learningArray.length);
        }
      );
    }, err => console.log(err));
  }



  getSrsSize() {
    console.log(this.user_id);
    this.wordService.getSrsSize(this.user_id)
    .then(
        (data: number) => {
          console.log('heyyyy');
          console.log(data);
          this.srsSize = data;
        },
        err => { console.log(err); }
     );
  }

  findWordIdAndRead() {
    this.wordService.findWordIdByUserId(this.user_id, this.current_word)
    .then(
        (data: number) => {
          console.log('heyyyy');
          console.log(data);
          this.word_id = data;
          this.wordService.readWord(data);
        },
        err => { console.log(err); }
     );
  }


  findWordIdAndSucceedTest() {
    this.wordService.findWordIdByUserId(this.user_id, this.current_word)
    .then(
        (data: number) => {
          console.log('heyyyy');
          console.log(data);
          this.word_id = data;
          this.wordService.succeedTest(data);
        },
        err => { console.log(err); }
     );
  }

  findWordIdAndFailTest() {
    this.wordService.findWordIdByUserId(this.user_id, this.current_word)
    .then(
        (data: number) => {
          console.log('heyyyy');
          console.log(data);
          this.word_id = data;
          this.wordService.failTest(data);
        },
        err => { console.log(err); }
     );
  }


  readWord() {
    console.log(this.word_id);
    this.wordService.readWord(this.word_id);
  }

  translateWord() {
    this.wordService.translateWord(this.current_word);
  }

  succeedTest() {
    this.wordService.succeedTest(this.word_id);
  }

  fetchVocalUrl(word) {
    this.wordService.fetchVocalUrl(word)
    .then( (data: string) => {
      this.vocalUrl = data;
      this.createAudioTag();
    });
  }

  createAudioTag() {
    const div = document.querySelector('.audioDiv');
    while (div.hasChildNodes()) {            // reset the audio tag for a new vocal
      div.removeChild(div.childNodes[0]);
    }
    const audio = document.createElement('audio');
    const source = document.createElement('source');
    const text = document.createTextNode('Your browser does not support the audio tag');
    source.setAttribute('type', 'audio/mpeg');
    source.setAttribute('src', this.vocalUrl);  // Will automatically play the fetched URL
    audio.setAttribute('controls', '');
    audio.setAttribute('id', 'audio');
    audio.setAttribute('style', 'display:none');  // To hide the audio player
    audio.appendChild(source);
    audio.appendChild(text);
    div.appendChild(audio);
    console.log(div.childNodes);
  }

  getSynonym(word) {
      this.wordService.getSynonym(word)
      .then( data => {
        // console.log(data)
        return(data);
      });
  }

  getRandomWords(user_id) {
    this.wordService.getRandomWords(user_id)
    .then(data => {
        console.log(data);
        return data;
    });
  }

  ngOnInit() {}
}
