import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manga',
  templateUrl: './manga.component.html',
  styleUrls: ['./manga.component.css']
})
export class MangaComponent implements OnInit {

  intensiveContent: any[];
  extensiveContent: any[];

  constructor() { }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.intensiveContent = null;
    this.extensiveContent = null;

    this.intensiveContent = [
      {
        title: "Aisazu Niha Irarenai",
        titleOriginal: "愛さずにはいられない",
        copyright: "よし まさこ",
        uri: "http://google.com/",
        img: "assets/manga-cover/AisazuNihaIrarenai.jpg",
        score: 13,
        counts: [0.4, 0.3, 0.1, 0.1, 0.05, 0.05]
      },
      {
        title: "Belmondo",
        titleOriginal: "ベルモンド Le VisiteuR",
        copyright: "石岡 ショウエイ",
        uri: "http://google.com/",
        img: "assets/manga-cover/Belmondo.jpg",
        score: 13,
        counts: [0.5, 0.2, 0.15, 0.05, 0.05, 0.05]
      },
      {
        title: "Belmondo",
        titleOriginal: "ベルモンド Le VisiteuR",
        copyright: "石岡 ショウエイ",
        uri: "http://google.com/",
        img: "assets/manga-cover/Belmondo.jpg",
        score: 13,
        counts: [0.5, 0.2, 0.15, 0.05, 0.05, 0.05]
      },
      {
        title: "Belmondo",
        titleOriginal: "ベルモンド Le VisiteuR",
        copyright: "石岡 ショウエイ",
        uri: "http://google.com/",
        img: "assets/manga-cover/Belmondo.jpg",
        score: 13,
        counts: [0.5, 0.2, 0.15, 0.05, 0.05, 0.05]
      },
      {
        title: "Belmondo",
        titleOriginal: "ベルモンド Le VisiteuR",
        copyright: "石岡 ショウエイ",
        uri: "http://google.com/",
        img: "assets/manga-cover/Belmondo.jpg",
        score: 13,
        counts: [0.5, 0.2, 0.15, 0.05, 0.05, 0.05]
      },
      {
        title: "Belmondo",
        titleOriginal: "ベルモンド Le VisiteuR",
        copyright: "石岡 ショウエイ",
        uri: "http://google.com/",
        img: "assets/manga-cover/Belmondo.jpg",
        score: 13,
        counts: [0.5, 0.2, 0.15, 0.05, 0.05, 0.05]
      },
      {
        title: "Belmondo",
        titleOriginal: "ベルモンド Le VisiteuR",
        copyright: "石岡 ショウエイ",
        uri: "http://google.com/",
        img: "assets/manga-cover/Belmondo.jpg",
        score: 13,
        counts: [0.5, 0.2, 0.15, 0.05, 0.05, 0.05]
      }
    ];
  }

}
