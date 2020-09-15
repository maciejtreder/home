import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as fs from 'fs';
import { TransferState } from '@angular/platform-browser';
import { map, tap } from 'rxjs/operators';
import { Post } from 'src/model/post.model';
import { StateKeys } from 'src/model/state-keys';
import { ContentService } from './content.service';

@Injectable({
  providedIn: 'root'
})
export class ContentServerService extends ContentService {

  constructor(private tss: TransferState) {
    super(null, null)
  }

  public getWriting(): Observable<Post[]> {
    return Observable.create(subject => {
      fs.readFile(`${process.cwd()}/src/assets/content/writing.json`, 'utf8', (err, data) => {
        subject.next(JSON.parse(data));
        subject.complete();
      });
    }).pipe(
      map((posts: Post[]) => this.convertDate(posts)),
      tap(value => this.tss.set(StateKeys.POSTS, value))
    );
  }
}
