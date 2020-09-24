import { Injectable } from '@angular/core';
import { Observable, of, merge } from 'rxjs';
import * as fs from 'fs';
import { StateKey, TransferState } from '@angular/platform-browser';
import { map, tap } from 'rxjs/operators';
import { Post } from 'src/model/post.model';
import { StateKeys } from 'src/model/state-keys';
import { ContentService } from './content.service';
import { WithDate } from 'src/model/withdate.model';
import { Speech } from 'src/model/speech.model';

@Injectable({
  providedIn: 'root'
})
export class ContentServerService extends ContentService {

  constructor(private tss: TransferState) {
    super(null, null)
    this.loadFiles().subscribe();
  }

  public getWriting(): Observable<Post[]> {
    return this.getFromFile<Post>(StateKeys.POSTS, 'writing').pipe(
      map(entries => entries.sort((entry1, entry2) => entry2.date - entry1.date))
    );
  }

  public getSpeaches(): Observable<Speech[]> {
    return this.getFromFile<Speech>(StateKeys.SPEECHES, 'speaking').pipe(
      map(entries => entries.sort((entry1, entry2) => entry2.date - entry1.date))
    );
  }

  private loadFiles(): Observable<any> {
    return merge(
      this.getFromFile<Speech>(StateKeys.SPEECHES, 'speaking'),
      this.getFromFile<Post>(StateKeys.POSTS, 'writing')
    )
  }

  private getFromFile<T extends WithDate>(key: StateKey<T[]>, endpoint: string):Observable<T[]> {
    return Observable.create(subject => {
      fs.readFile(`${process.cwd()}/src/assets/content/${endpoint}.json`, 'utf8', (err, data) => {
        subject.next(JSON.parse(data));
        subject.complete();
      });
    }).pipe(
      map((posts: T[]) => this.convertDate(posts)),
      tap(value => this.tss.set(key, value))
    );
  }
}
