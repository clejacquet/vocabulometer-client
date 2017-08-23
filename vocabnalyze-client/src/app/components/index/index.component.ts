import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ParameterHandler } from '../parameter-control';

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

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.auth.info((err, user) => {
      if (err) {
        return console.error(err);
      }

      this.userHandler = user;
    });
  }

  onLog(): void {
    this.auth.local(this.username, this.password, (err, user: ParameterHandler<any>) => {
      if (err) {
        return console.error(err);
      }

      if (user) {
        this.userHandler = user;
      } else {
        console.log('Auth failed');
      }
    });
  }
}
