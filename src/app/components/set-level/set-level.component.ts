import {Component, ElementRef, OnInit} from '@angular/core';
import {QuizService} from '../../services/quiz.service';
import {ParameterHandler} from '../parameter-control';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-set-level',
  templateUrl: './set-level.component.html',
  styleUrls: ['./set-level.component.css'],
  providers: [ QuizService ]
})
export class SetLevelComponent implements OnInit {

  constructor(private element: ElementRef,
              private router: Router,
              private quizService: QuizService,
              private authService: AuthService) { }

  ngOnInit() {
  }

  onSave() {
    this.quizService.saveResult(this.element.nativeElement.querySelector('#cefr-level').value, (err, success) => {
      if (err) {
        return console.error(err);
      }

      if (success) {
        console.log('Words saved! You can check on Stats page');
      }

      this.authService.info((err1, user: ParameterHandler<any>) => {
        if (err1) {
          console.error(err1);
        } else {
          user.value.hasVocabSaved = true;
        }

        this.router.navigate(['/']);
      });

    });
  }

}
