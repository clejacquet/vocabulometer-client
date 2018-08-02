import {Component, OnInit, ViewChild} from '@angular/core';
import {StatsService} from '../../services/stats.service';
import {ProfileReadingComponent} from '../profile-reading/profile-reading.component';
import {ProfileReviewComponent} from '../profile-review/profile-review.component';


declare const google: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [StatsService]
})
export class ProfileComponent implements OnInit {
  MODES = {
    review: 'Review Profile',
    reading: 'Reading Profile'
  };


  @ViewChild(ProfileReviewComponent) review: ProfileReviewComponent;
  @ViewChild(ProfileReadingComponent) reading: ProfileReadingComponent;

  mode: String;

  ngOnInit() {
    this.mode = this.getModeKeys()[0];
  }

  getModeKeys() {
    return Object.keys(this.MODES);
  }

  setMode(mode) {
    this.mode = mode;

    if (mode === 'review') {
      this.review.refresh();
    }
    if (mode === 'reading') {
      this.reading.refresh();
    }
  }
}

