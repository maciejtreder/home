import { Component } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'home-view',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    animations: [
      trigger('state', [
        state('inactive', style({
          color: '#efefef',
          'z-index': '-1'
        })),
        state('active', style({
          color: '#aaaaaa',
          'z-index': '1'
        })),
        transition('inactive => active', animate('500ms ease-in')),
        transition('active => inactive', animate('500ms ease-out'))
      ])
    ]
})
export class HomeComponent {

  public states = {
    name: 'inactive',
    tld: 'inactive',
    social: 'inactive',
    email: 'inactive',
    phoneNumber: 'inactive'
  };

  public nameState = 'inactive';

  public animate(what: ('social' | 'email' | 'phone')): void {

    if (what === 'social') {
      this.setActive(['name', 'social']);
    } else if (what === 'email') {
      this.setActive(['name', 'social', 'email', 'tld']);
    } else {
      this.setActive(['phoneNumber']);
    }
  }

  public setActive(what: string[]) {
    for (let state in this.states) {
      if (what.findIndex(entry => entry === state) > -1) {
        this.states[state] = 'active';
      } else {
        this.states[state] = 'inactive';
      }
    }
  }
}
