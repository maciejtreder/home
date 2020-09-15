import { Component } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  animations: [
    trigger('state', [
      state('highlight', style({
        color: '#555555',
        'z-index': '1',
      })),
      state('active', style({
        color: '#efefef',
        display: 'block'
      })),
      state('inactive', style({
        display: 'none'
      })),
      transition('active => highlight', animate('500ms ease-in')),
    ])
  ]
})

export class FooterComponent {

  public freezed: string;
  
  public states = {
    twitter: 'inactive',
    stackoverflow: 'inactive',
    linkedin: 'inactive',
    npm: 'inactive',
    github: 'inactive',
    gitlab: 'inactive',
    email: 'inactive',
    skype: 'inactive',
    phone: 'inactive'
  };

  public animate(what: string): void {
    if (this.freezed) {
      return;
    }

    this.performAnimation(what);
  }

  public handleClick(event): void {
    if (this.freezed != event.target.name) {
      event.preventDefault();
    }
    
    
    console.log(!!this.freezed);
    if (!!this.freezed) {
      this.performAnimation(event.target.name);
    }

    this.freezed = event.target.name;
  }

  private performAnimation(what: string): void {
    for (let state in this.states) {
      this.states[state] = 'inactive';
    }
    this.states[what] = 'active'
    setTimeout(() => this.states[what] = 'highlight', 0);
  }
}
