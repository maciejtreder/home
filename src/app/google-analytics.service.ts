import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {

  constructor() { }

  public trackEvent(name: string) {
    (<any>window).gtag('event', 'click', {
      'event_category': 'outbound',
      'event_label': name,
      'transport_type': 'beacon'
    });
  }
}
