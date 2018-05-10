import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ParameterHandler } from '../parameter-control';
import {Router} from '@angular/router';

class FakeWindow extends Window {
  public $;
}

const fwindow: FakeWindow = <FakeWindow> window;
const $ = fwindow.$;

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  providers: [AuthService]
})
export class IndexComponent implements OnInit {
  userHandler = ParameterHandler.buildDefault(null);
  username: string;
  password: string;

  constructor(private router: Router,
              private auth: AuthService) { }

  ngOnInit(): void {
    this.auth.info((err, user: ParameterHandler<any>) => {
      if (err) {
        return console.error(err);
      }

      this.userHandler = user;

      console.log(user.value);

      if (user.value.hasVocabSaved === false) {
        $('#myModal').modal({
          show: true,
          backdrop: 'static',
          keyboard: false
        });
      }
    });
  }

  onLevel() {
    $('#myModal').modal('hide');
    this.router.navigate(['level']);
  }

  onQuiz() {
    $('#myModal').modal('hide');
    this.router.navigate(['quiz']);
  }

  onLogOut() {
    this.auth.logout((err) => {
      if (err) {
        console.error(err);
      }
      $('#myModal').modal('hide');
      this.router.navigate(['/']);
    })
  }

  onLog(): void {
    this.auth.local(this.username, this.password, (err, user: ParameterHandler<any>) => {
      if (err) {
        return console.error(err);
      }

      if (user) {
        this.userHandler = user;

        if (user.value.hasVocabSaved === false) {
          $('#myModal').modal({
            show: true,
            backdrop: 'static',
            keyboard: false
          });
        }
      } else {
        console.log('Auth failed');
      }
    });
  }
}
