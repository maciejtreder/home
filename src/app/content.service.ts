import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs';
import { StateKey, TransferState } from '@angular/platform-browser';
import { StateKeys } from 'src/model/state-keys';
import { Post } from 'src/model/post.model';
import { map } from 'rxjs/operators';
import { WithDate } from 'src/model/withdate.model';
import { Speech } from 'src/model/speech.model';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  constructor(private http: HttpClient, private ts: TransferState) {
  }

  private url: string = '/assets/content/';

  public getWriting(): Observable<Post[]> {
    return this.getFromTS<Post>(StateKeys.POSTS, 'writing').pipe(
      map(entries => entries.sort((entry1, entry2) => entry2.date.getTime() - entry1.date.getTime()))
    );
  }

  public getSpeaches(): Observable<Speech[]> {
    return this.getFromTS<Speech>(StateKeys.SPEECHES, 'speaking').pipe(
      map(entries => entries.sort((entry1, entry2) => entry2.date.getTime() - entry1.date.getTime()))
    );
  }

  private getFromTS<T extends WithDate>(key: StateKey<T[]>, endpoint: string):Observable<T[]> {
    if (this.ts.hasKey(key)) {
      return new Observable(observer => {
        setTimeout(() => {
          observer.next(this.ts.get<T[]>(key, null));
          observer.complete();
        }, 0);
      })
      // return of(this.ts.get<T[]>(key, null));
    } else {
      return this.http.get<T[]>(`${this.url}${endpoint}.json`).pipe(
        map((items: T[]) => this.convertDate(items)),
      );
    }
  }

  protected convertDate<T extends WithDate>(items: T[]): T[] {
    items.forEach(item => {
      item.date = new Date(<number>(<unknown> item.date) * 1000);
    })
    return items;
  }
}
