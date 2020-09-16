import { makeStateKey, StateKey } from '@angular/platform-browser';
import { Post } from './post.model';

export class StateKeys {
    public static get POSTS(): StateKey<Post[]> {return makeStateKey<Post[]>('posts')};
    public static get SPEECHES(): StateKey<Post[]> {return makeStateKey<Post[]>('speeches')};
}