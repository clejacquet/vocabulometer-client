import { Injectable } from '@angular/core';
import { HostService } from './host.service';
import { AuthHttpService } from './auth-http.service';

@Injectable()
export class StatsService {
  private static dateOffset(date, dayOffset): Date {
    return new Date(date + 1000 * 60 * 60 * 24 * dayOffset);
  }

  private static isSameDate(date1, date2): boolean {
    return date1.toDateString() === date2.toDateString();
  }

  private static toDayDate(date): Date {
    return new Date(date.toDateString());
  }

  constructor(private authHttp: AuthHttpService) {}

  wordsRead(limit, cb): void {
    this.authHttp
      .get(HostService.url('/api/users/current/stats/words_read'), { limit: limit })
      .map(res => res.json())
      .toPromise()
      .then(res => cb(null, res.days))
      .catch(err => cb(err));
  }

  newWordsRead(limit, cb): void {
    this.authHttp
      .get(HostService.url('/api/users/current/stats/new_words_read'), { limit: limit })
      .map(res => res.json())
      .toPromise()
      .then(res => cb(null, res.days))
      .catch(err => cb(err));
  }

  newRecentWordsRead(limit, cb): void {
    this.authHttp
      .get(HostService.url('/api/users/current/stats/new_recent_words_read'), { limit: limit })
      .map(res => res.json())
      .toPromise()
      .then(res => cb(null, res.words))
      .catch(err => cb(err));
  }

  lastWeek(daysValues): any[] {
    return Array(14).fill(0).map((val, i) => {
      const dayTarget = StatsService.toDayDate(StatsService.dateOffset(Date.now(), -i));
      const dayValue = daysValues.find(day => StatsService.isSameDate(new Date(day._id), dayTarget));
      if (dayValue) {
        return { day: dayTarget, count: dayValue.count };
      } else {
        return { day: dayTarget, count: 0 };
      }
    })
  }
}
