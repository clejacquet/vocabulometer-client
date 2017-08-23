import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TextService } from '../../services/text.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  providers: [ TextService ]
})
export class AdminComponent implements OnInit {
  texts: any[];

  @ViewChild('titleinput')
  private titleInput: ElementRef;

  @ViewChild('textinput')
  private textInput: ElementRef;

  private page: number;

  constructor(private textService: TextService,
              private router: Router) { }

  private refreshTexts() {
    this.textService.getTextsOnPage(this.page, (err, texts) => {
      if (err) {
        return console.error(err);
      }

      this.texts = texts;
    })
  }

  ngOnInit() {
    this.page = null;
    this.refreshTexts();
  }

  onSettingsClick(textId) {
    this.router.navigate(['/admin/texts/', textId]);
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
    })
  }

  onTextAdd() {
    const title = this.titleInput.nativeElement.value;
    const text = this.textInput.nativeElement.value;

    this.textService.addText(title, text, (err, result) => {
      if (err) {
        console.error(err);
      }

      this.refreshTexts();
    })
  }
}
