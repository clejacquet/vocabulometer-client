import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ParameterHandler } from './parameter-control';
import { Router } from '@angular/router';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', '../../assets/css/bootstrap.min.css'],
})
export class AppComponent implements OnInit {
  userHandler = ParameterHandler.buildDefault(null);

  constructor(private auth: AuthService,
              private router: Router) {}

  ngOnInit(): void {
    AuthService.Init();
    LanguageService.Init();

    this.auth.info((err, user) => {
      if (err) {
        return console.error(err);
      }

      this.userHandler = user;
    });
  }

  onLogOut(): void {
    this.auth.logout((err) => {
      if (err) {
        console.error(err);
      }
      this.router.navigate(['/']);
    })
  }

  onUserClick(): void {
    this.router.navigate(['/profile']);
  }
}
