import { Component, OnInit } from '@angular/core';
import { ContentService } from 'src/app/content.service';

@Component({
  selector: 'app-writing',
  templateUrl: './writing.component.html',
  styleUrls: [
    '../../component.scss',
    './writing.component.scss'
  ]
})
export class WritingComponent implements OnInit {

  constructor(private cs: ContentService) { }

  public posts = this.cs.getWriting().pipe();

  ngOnInit(): void {
  }

}
