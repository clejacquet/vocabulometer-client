import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ParameterHandler } from './parameter-control';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', '../../assets/css/bootstrap.min.css'],
})
export class AppComponent implements OnInit {
  userHandler = ParameterHandler.buildDefault(null);

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    AuthService.Init();

    this.auth.info((err, user) => {
      if (err) {
        return console.error(err);
      }

      this.userHandler = user;
    });
  }
}
