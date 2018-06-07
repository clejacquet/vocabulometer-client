import {Component, OnDestroy, OnInit} from '@angular/core';
import { TextService } from '../../services/text.service';
import { ActivatedRoute } from '@angular/router';
import {ParserService} from '../../services/parser.service';

@Component({
  selector: 'app-text-structure',
  templateUrl: './text-structure.component.html',
  styleUrls: ['./text-structure.component.css'],
  providers: [TextService]
})
export class TextStructureComponent implements OnInit, OnDestroy {
  text: any;

  private routeSub: any;
  private textId: string;
  private oldTitle: string;
  private oldText: string;

  constructor(private textService: TextService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.textId = params['id'];

      // Loading the content
      this.textService.getText(this.textId, (err, result) => {
        if (err) {
          return console.error(err);
        }

        this.oldTitle = result.title;
        this.oldText = ParserService.parse(result.body);

        this.text = {
          title: this.oldTitle,
          body: this.oldText
        }
      })
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  onTextSave() {
    if (this.text.body !== this.oldText) {
      this.textService.setText(this.textId, this.text.body, (err, result) => {
        if (err) {
          return console.error(err);
        }

        if (result) {
          alert('content saved');
        }
      });
    }

    if (this.text.title !== this.oldTitle) {
      this.textService.setTitle(this.textId, this.text.title, (err, result) => {
        if (err) {
          return console.error(err);
        }

        if (result) {
          alert('title saved');
        }
      });
    }
  }
}
