import { Component, OnInit } from '@angular/core';
import { ContentService } from 'src/app/content.service';
import { GoogleAnalyticsService } from '../google-analytics.service';

@Component({
  selector: 'app-writing',
  templateUrl: './writing.component.html',
  styleUrls: [
    '../../component.scss',
    './writing.component.scss'
  ]
})
export class WritingComponent implements OnInit {

  constructor(private cs: ContentService, private ga: GoogleAnalyticsService) { }

  public posts = this.cs.getWriting();

  ngOnInit(): void {
  }

  public handleClick(name: string): void {
    this.ga.trackEvent(name);
  }
}
