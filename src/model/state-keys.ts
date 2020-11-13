import { makeStateKey, StateKey } from '@angular/platform-browser';
import { Post } from './post.model';
import { Speech } from './speech.model';
import { Course } from './course.model';

export class StateKeys {
    public static get POSTS(): StateKey<Post[]> {return makeStateKey<Post[]>('posts')};
    public static get SPEECHES(): StateKey<Speech[]> {return makeStateKey<Speech[]>('speeches')};
    public static get COURSES(): StateKey<Course[]> {return makeStateKey<Course[]>('courses')};
}