import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ContentService } from '../content.service';
import { GoogleAnalyticsService } from '../google-analytics.service';

@Component({
  selector: 'app-speaking',
  templateUrl: './speaking.component.html',
  styleUrls: ['../../component.scss','./speaking.component.scss']
})
export class SpeakingComponent implements OnInit {

  public speeches = this.cs.getSpeeches();
  public display: any[];

  public selectedTag$: Subject<string> = new Subject<string>();

  constructor(private cs: ContentService, private ga: GoogleAnalyticsService) { }

  ngOnInit(): void {
  }

  public selectTag(tag: string) {
    this.selectedTag$.next(tag);
  }

  public handleClick(name: string): void {
    this.ga.trackEvent(name);
  }
  
  public listRefined(event): void {
    this.display = event;
  }
}
