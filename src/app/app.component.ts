import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, fromEvent, Observable, of, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { NgAnimateScrollService } from 'ng-animate-scroll';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('state', [
      state('visible', style({
        opacity: 1,
        'z-index': 1,
      })),
      state('unvisible', style({
        opacity: 0,
        'z-index': -1,
      })),
      transition('unvisible => visible', animate('500ms ease-in')),,
      transition('visible => unvisible', animate('500ms ease-out')),
    ])
  ]
})
export class AppComponent {

  public displayMenu: Observable<boolean> = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    map((event: NavigationEnd) => event.urlAfterRedirects),
    map(url => url != '/'),
    distinctUntilChanged()
  );

  public scrollState: Subject<string> = new BehaviorSubject('unvisible');

  constructor(private router: Router, private animateScrollService: NgAnimateScrollService, @Inject(PLATFORM_ID) private platformId: any){}

  public navigateToHeader() {
    this.animateScrollService.scrollToElement('header', 500)
  }

  ngOnInit() {
    if(isPlatformBrowser(this.platformId)) {
      fromEvent(window, 'scroll').pipe(
        map(() => window.pageYOffset > 0),
        distinctUntilChanged(),
        map(display => display?'visible':'unvisible')
      ).subscribe(val => {
        this.scrollState.next(val);
      })
    } else {
      this.scrollState.next('unvisible');
      this.scrollState.complete();
    }
  }
}
