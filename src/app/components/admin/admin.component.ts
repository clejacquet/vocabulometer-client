import { Component, OnInit } from '@angular/core';
import {AdminService} from '../../services/admin.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  providers: [AdminService]
})
export class AdminComponent implements OnInit {
  status: string;
  authUrl: string;
  filesToUpload: File[];

  constructor(private admin: AdminService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.admin.youtubeState((err, status) => {
      if (err) {
        return console.error(err);
      }

      if (status === 'down') {
        this.route.queryParams.subscribe(params => {
          const code = params['code'];

          if (code) {
            this.admin.launchYoutube(code, (err1, result) => {
              if (err1) {
                return console.error(err1);
              }

              this.status = result;
            });
          } else {
            this.status = status;
            this.admin.youtubeAuthUrl((err1, url) => {
              if (err1) {
                return console.error(err1);
              }

              this.authUrl = url;
            })
          }
        });
      } else {
        this.status = status;
      }
    });
  }

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>> fileInput.target.files;
  }

  upload() {
    this.admin.credentials(this.filesToUpload[0], (err, status) => {
      if (err) {
        return console.error(err);
      }

      this.status = status;
    })
  }

}
