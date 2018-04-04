import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { TextService } from '../../services/text.service';
import {ActivatedRoute, Router} from '@angular/router';
import { isNull } from 'util';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  providers: [ TextService ]
})
export class AdminComponent implements OnInit, OnDestroy {
  texts: any[];
  pageNumbers: number[];

  @ViewChild('titleinput')
  private titleInput: ElementRef;

  @ViewChild('textinput')
  private textInput: ElementRef;

  page: number;
  lastPage: number;
  private routeSub: any;

  constructor(private textService: TextService,
              private router: Router,
              private route: ActivatedRoute) { }

  private refreshTexts() {
    this.textService.getTextsOnPage(this.page, (err, texts, lastPage) => {
      if (err) {
        return console.error(err);
      }

      this.lastPage = lastPage;
      this.pageNumbers = this.computePageNumbers(lastPage);
      this.texts = texts;
    });
  }

  private computePageNumbers(lastPage) {
    if (isNull(lastPage)) {
      return [];
    }

    const pageNumbers = [];
    for (let i = Math.max(0, this.page - 2) ; i <= Math.min(this.page + 2, lastPage); i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.page = parseInt(params['id'], 10) - 1;

      if (isNaN(this.page)) {
        this.page = 0;
      }

      this.refreshTexts();
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  onSettingsClick(textId) {
    this.router
      .navigate(['/admin/texts/', textId])
      .catch((err) => console.log(err));
  }

  onRemoveClick(textId) {
    if (!confirm('Do you really want to delete this text?')) {
      return;
    }

    this.textService.deleteText(textId, (err, status) => {
      if (err) {
        return console.error(err);
      }

      if (status) {
        this.refreshTexts();
      }
    });
  }

  onTextAdd() {
    const title = this.titleInput.nativeElement.value;
    const text = this.textInput.nativeElement.value;

    this.textService.addText(title, text, (err) => {
      if (err) {
        console.error(err);
      }

      this.refreshTexts();
    });
  }

  onPageChange(page: number) {
    if (page < 0 || page > this.lastPage) {
      return;
    }

    this.page = page;
    this.refreshTexts();
  }
}
