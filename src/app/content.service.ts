import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs';
import { TransferState } from '@angular/platform-browser';
import { StateKeys } from 'src/model/state-keys';
import { Post } from 'src/model/post.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  constructor(private http: HttpClient, private ts: TransferState) { }

  private url: string = '/assets/content/';

  public getWriting(): Observable<Post[]> {
    if (this.ts.hasKey(StateKeys.POSTS)) {
      return of(this.ts.get<Post[]>(StateKeys.POSTS, null));
    } else {
      return this.http.get<Post[]>(`${this.url}writing.json`).pipe(
        map((posts: Post[]) => this.convertDate(posts)),
      );
    }
  }

  protected convertDate(posts: Post[]): Post[] {
    posts.forEach(post => {
      post.date = new Date(<number>(<unknown> post.date) * 1000);
    })
    return posts;
  }
}
