import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';


const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
};


@Injectable()
export class WordService {

    private srsSize = 1000;  // a changer

    private learningArray: String[] = [];
    private learningArrayFetch = false;
    private learningArrayLength = 10;

    private myKey = '41044800ddd37e9b1d50cc137e5e843c';  // key to use the vocal synthesis API
    private lg_speaker = 'en_us';   // english
    private voice = 'James';  // name of the voice (depends of the language: see the API for more details)

    private myKey2 = '546dfb52f5285442504d648e58e78959';


    constructor(private http: HttpClient) {
    }

    // Uses http.get() to load data from a single API endpoint
    getWordsToLearn(user_id) {
        return new Promise((resolve, reject) => {
            this.http.get('http://localhost:4100/api/srs/findwordstolearn/' + user_id)
                .subscribe(
                    (data: [any]) => {
                        if (data.length) {
                            this.learningArray = [];   // reset the learning array
                            for (let i = 0; i < data.length; i++) {
                                for (let j = 0; j < data[i].length; j++) {
                                    this.learningArray.push(data[i][j].word);  // see on the server side the shape of data (list of lists)
                                    if (this.learningArray.length > this.learningArrayLength) {
                                        break;
                                    }
                                }
                            }
                            // the learningArray must not countain more than learningArrayLength elements
                            resolve(this.learningArray.slice(0, this.learningArrayLength));
                        }
                        if (!data.length) {
                            console.log('No more words to learn');
                            resolve();
                        }
                    }
                );

        });
    }


    getSrsSize(user_id) {
        return new Promise((resolve, reject) => {
            this.http.get('http://localhost:4100/api/srs/srs/getsize/' + user_id)
                .subscribe(
                    (data: [any]) => {
                        if (data !== null) {
                            console.log('data exists');
                            console.log(data);
                            resolve(data);
                        }
                        if (data === null) {  // remplacer : erreur a gerer
                            console.log('User not found');
                            reject();
                        }
                    }
                );
        });
    }

    findWordIdByUserId(user_id, word) {
        return new Promise((resolve, reject) => {
            this.http.get('http://localhost:4100/api/srs/findwordidbyuserid/' + user_id + '/' + word)
                .subscribe(
                    (data: [any]) => {
                        if (data !== null) {

                            resolve(data);
                        }
                        if (data === null) {  // remplacer : erreur a gerer
                            console.log('User not found');
                            reject();
                        }
                    }
                );
        });
    }


    readWord(word_id) {
        return new Promise((resolve, reject) => {
            this.http.post('http://localhost:4100/api/srs/readword/' + word_id, {})
                .subscribe(
                    (data: [any]) => {
                        console.log('word read');
                        resolve(data);
                    }
                );
        });
    }


    translateWord(word) {
        return new Promise((resolve, reject) => {
            console.log('translating...');
            // src and dst can be send dynamically here
            this.http.get('http://localhost:4100/api/srs/translate/' + word + '?src=en' + '&dst=fr')
                .subscribe(
                    (data: [any]) => {
                        resolve(data);
                    }
                );
        });
    }

    succeedTest(word_id) {
        this.http.post('http://localhost:4100/api/srs/test/succeed/' + word_id, {})
            .subscribe(
                (data: [any]) => {
                    console.log('test succeeded');
                }
            );
    }

    failTest(word_id) {
        this.http.post('http://localhost:4100/api/srs/test/fail/' + word_id, {})
            .subscribe(
                (data: [any]) => {
                    console.log('test failed');
                }
            );
    }

    fetchVocalUrl(word) {
        return new Promise((resolve, reject) => {
            resolve('http://tts.readspeaker.com/a/speak?key=' +
                this.myKey + '&lang=' + this.lg_speaker + '&voice=' + this.voice + '&text=' + word);
        });
    }

    getSynonym(word) {
        return new Promise((resolve, reject) => {
            this.http.get('http://words.bighugelabs.com/api/2/' + this.myKey2 + '/' + word + '/json')
                .subscribe(
                    (data: any) => {
                        let l1 = 0,
                            l2 = 0,
                            l3 = 0,
                            l4 = 0,
                            noun = '',
                            adverb = '',
                            verb = '',
                            adjective = '',
                            response;
                        if (data.noun !== undefined && data.noun.syn !== undefined) {
                            l1 = data.noun.syn.length;
                            noun = data.noun.syn[0];
                            if (noun === word) {
                                noun = data.noun.syn[1];
                            }
                        }
                        if (data.adverb !== undefined && data.adverb.syn !== undefined) {
                            l2 = data.adverb.syn.length;
                            adverb = data.adverb.syn[0];
                            if (adverb === word) {
                                adverb = data.adverb.syn[1];
                            }
                        }
                        if (data.verb !== undefined && data.verb.syn !== undefined) {
                            l3 = data.verb.syn.length;
                            verb = data.verb.syn[0];
                            if (verb === word) {
                                verb = data.verb.syn[1];
                            }
                        }
                        if (data.adjective !== undefined && data.adjective.syn !== undefined) {
                            l4 = data.adjective.syn.length;
                            adjective = data.adjective.syn[0];
                            if (adjective === word) {
                                adjective = data.adjective.syn[1];
                            }
                        }
                        const max = Math.max(l1, l2, l3, l4);  // the synonym is picked from the longest list
                        if (max === l1) {
                            response = noun;
                        }
                        if (max === l2) {
                            response = adverb;
                        }
                        if (max === l3) {
                            response = verb;
                        }
                        if (max === l4) {
                            response = adjective;
                        }
                        if (response === undefined) {
                            reject('No synonyms were found');
                        }
                        resolve(response); // first synonym is send for each type
                    }
                );
        });
    }


    getRandomWords(user_id) {
        return new Promise((resolve, reject) => {
            this.http.get('http://localhost:4100/api/srs/srs/getallwords/' + user_id)
                .subscribe(
                    (data: [any]) => {
                        const randNumber1 = Math.floor(Math.random() * this.srsSize);
                        const randNumber2 = Math.floor(Math.random() * this.srsSize);
                        const randNumber3 = Math.floor(Math.random() * this.srsSize);
                        const array = [data[randNumber1], data[randNumber2], data[randNumber3]];
                        resolve(array);
                    }
                );
        });
    }


    getDefinition(word) {
        return new Promise((resolve, reject) => {
            this.http.get('http://localhost:4100/api/srs/definition/' + word)
                .subscribe(
                    (data: [any]) => {
                        resolve(data);
                    }
                );
        });
    }


}
