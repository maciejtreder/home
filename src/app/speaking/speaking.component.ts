import { Component, OnInit } from '@angular/core';
import { ContentService } from '../content.service';
import { GoogleAnalyticsService } from '../google-analytics.service';

@Component({
  selector: 'app-speaking',
  templateUrl: './speaking.component.html',
  styleUrls: ['../../component.scss','./speaking.component.scss']
})
export class SpeakingComponent implements OnInit {

  public speeches = this.cs.getSpeeches();

  constructor(private cs: ContentService, private ga: GoogleAnalyticsService) { }

  ngOnInit(): void {
  }

  public handleClick(name: string): void {
    this.ga.trackEvent(name);
  }

}
