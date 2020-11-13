import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { ContentService } from 'src/app/content.service';
import { GoogleAnalyticsService } from '../google-analytics.service';

@Component({
  selector: 'app-teaching',
  templateUrl: './teaching.component.html',
  styleUrls: ['../../component.scss','./teaching.component.scss','../speaking/speaking.component.scss']
})
export class TeachingComponent {

  public courses = this.cs.getCourses();
  public display: any[];

  public selectedTag$: Subject<string> = new Subject<string>();

  constructor(private cs: ContentService, private ga: GoogleAnalyticsService) { }

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
